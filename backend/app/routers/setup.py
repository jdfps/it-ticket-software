"""First deployment bootstrap: installer-provided secret, one-time database lock."""
import hmac
import os

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app import models, schemas, security
from app.database import get_db

router = APIRouter(prefix="/setup", tags=["initial setup"])


def _valid_setup_key() -> str | None:
    key = os.getenv("INITIAL_SETUP_KEY", "")
    return key if len(key) >= 24 else None


@router.get("/status", response_model=schemas.SetupStatus)
def setup_status(db: Session = Depends(get_db)):
    state = db.get(models.InstallationState, 1)
    has_users = db.query(models.User.user_id).first() is not None
    return {
        "setup_required": not has_users and not (state and state.initialized),
        "setup_key_configured": _valid_setup_key() is not None,
    }


@router.post("/initialize", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def initialize(payload: schemas.InitialAdminCreate, db: Session = Depends(get_db)):
    expected_key = _valid_setup_key()
    if expected_key is None:
        raise HTTPException(503, "Initial setup is not configured. Set INITIAL_SETUP_KEY on the server (24+ characters).")

    # Check authorization BEFORE acquiring the database lock. Never log the key.
    if not hmac.compare_digest(payload.setup_key, expected_key):
        raise HTTPException(403, "Invalid setup key.")

    # This singleton row is initialized at application startup. FOR UPDATE ensures
    # concurrent workers cannot each create their own first admin.
    state = (
        db.query(models.InstallationState)
        .filter(models.InstallationState.id == 1)
        .with_for_update()
        .one()
    )

    if state.initialized or db.query(models.User.user_id).first() is not None:
        raise HTTPException(409, "This installation is already initialized.")

    admin = models.User(
        first_name=payload.first_name,
        last_name=payload.last_name,
        email=str(payload.email).strip().lower(),
        password_hash=security.hash_password(payload.password),
        role="admin",
        must_change_password=False,
    )
    db.add(admin)
    state.initialized = True
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Initial setup could not be completed; check if an administrator already exists.")
    db.refresh(admin)
    return admin
