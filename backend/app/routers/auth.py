from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas, security
from app.database import get_db
from app.authentication import issue_token, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    email = payload.email.strip().lower()

    user = db.query(models.User).filter(models.User.email == email).first()

    if not user or not security.verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )

    return schemas.LoginResponse(user=user, access_token=issue_token(user))


@router.get("/me", response_model=schemas.UserOut)
def me(user: models.User = Depends(get_current_user)):
    return user


@router.put("/set-password", response_model=schemas.SetPasswordResponse)
def set_password(payload: schemas.SetPasswordRequest, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if payload.user_id != current_user.user_id:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "You may only change your own password.")
    user = current_user

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    # Name confirmation is an additional check, NOT proof of identity.
    # The user must already have authenticated with their temporary password.
    if (payload.first_name.strip().casefold() != user.first_name.strip().casefold() or
            payload.last_name.strip().casefold() != user.last_name.strip().casefold()):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, "First and last name do not match this account.")

    user.password_hash = security.hash_password(payload.new_password)
    user.must_change_password = False

    db.commit()
    db.refresh(user)

    return schemas.SetPasswordResponse(user=user, access_token=issue_token(user))