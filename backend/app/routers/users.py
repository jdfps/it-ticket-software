from typing import List, Optional
import secrets

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas, security
from app.database import get_db
from app.authentication import require_roles

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def create_user(payload: schemas.UserCreate, db: Session = Depends(get_db), current_user: models.User = Depends(require_roles("admin"))):
    email = payload.email.strip().lower()

    existing = db.query(models.User).filter(models.User.email == email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A user with this email already exists.",
        )

    user = models.User(
        first_name=payload.first_name.strip(),
        last_name=payload.last_name.strip(),
        email=email,
        password_hash=security.hash_password(payload.temporary_password),
        role=payload.role,
        must_change_password=True,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


@router.get("", response_model=List[schemas.UserOut])
def list_users(role: Optional[str] = None, db: Session = Depends(get_db), current_user: models.User = Depends(require_roles("admin", "technician", "employee"))):
    query = db.query(models.User)

    if current_user.role == "employee":
        query = query.filter(models.User.user_id == current_user.user_id)
    elif current_user.role == "technician":
        query = query.filter(models.User.role.in_(["technician", "employee"]))
    if role:
        query = query.filter(models.User.role == role)

    return query.order_by(models.User.user_id).all()


@router.get("/{user_id}", response_model=schemas.UserOut)
def get_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(require_roles("admin", "technician", "employee"))):
    if current_user.role == "employee" and user_id != current_user.user_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Access denied.")
    user = db.query(models.User).filter(models.User.user_id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    return user

@router.post("/{user_id}/reset-password", response_model=schemas.AdminPasswordResetResponse)
def reset_user_password(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(require_roles("admin")),
):
    """Admin issues a one-time-display temporary credential. Password hashes are never shown."""
    user = db.get(models.User, user_id)
    if not user:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "User not found.")
    if user.user_id == current_user.user_id:
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "You cannot reset your own password from Account Management.")
    temp_password = secrets.token_urlsafe(18)
    user.password_hash = security.hash_password(temp_password)
    user.must_change_password = True
    db.commit()
    return schemas.AdminPasswordResetResponse(
        user_id=user.user_id,
        email=user.email,
        temporary_password=temp_password,
    )
