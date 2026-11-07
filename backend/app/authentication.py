"""Signed, expiring bearer tokens with authorization checked from the database."""
import hashlib
import os
from datetime import timedelta
from typing import Callable

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from itsdangerous import URLSafeTimedSerializer, BadSignature, SignatureExpired
from sqlalchemy.orm import Session

from app import models
from app.database import get_db

bearer = HTTPBearer(auto_error=False)
TOKEN_AGE_SECONDS = 12 * 60 * 60


def _serializer():
    secret = os.getenv("AUTH_SECRET_KEY", "")
    if len(secret) < 32:
        raise RuntimeError("AUTH_SECRET_KEY must be set to a random string of at least 32 characters.")
    return URLSafeTimedSerializer(secret, salt="it-ticket-auth-v1")


def _password_fingerprint(user: models.User) -> str:
    # Password changes invalidate existing tokens without a new database table.
    return hashlib.sha256(user.password_hash.encode()).hexdigest()[:20]


def issue_token(user: models.User) -> str:
    return _serializer().dumps({"uid": user.user_id, "pwd": _password_fingerprint(user)})


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> models.User:
    if not credentials or credentials.scheme.lower() != "bearer":
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Authentication required.", headers={"WWW-Authenticate": "Bearer"})
    try:
        token_data = _serializer().loads(credentials.credentials, max_age=TOKEN_AGE_SECONDS)
        user_id = token_data.get("uid")
        if type(user_id) is not int:
            raise ValueError("Invalid user ID")
        user = db.get(models.User, user_id)
        if not user or token_data.get("pwd") != _password_fingerprint(user):
            raise ValueError("No longer valid")
        return user
    except (BadSignature, SignatureExpired, ValueError, TypeError):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Session expired or invalid. Please log in again.", headers={"WWW-Authenticate": "Bearer"})


def require_roles(*roles: str) -> Callable:
    def check(user: models.User = Depends(get_current_user)) -> models.User:
        if user.must_change_password:
            raise HTTPException(403, "Change your temporary password before continuing.")
        if user.role not in roles:
            raise HTTPException(403, "You do not have permission to perform this action.")
        return user
    return check


def can_view_ticket(user: models.User, ticket: models.Ticket) -> bool:
    return (user.role == "admin" or
            (user.role == "employee" and ticket.user_id == user.user_id) or
            (user.role == "technician" and ticket.status != "pending" and ticket.status != "rejected"))
