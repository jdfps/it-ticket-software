from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator

Role = Literal["employee", "technician", "admin"]
TicketStatus = Literal["pending", "open", "in_progress", "resolved", "rejected"]


# =====================================================
# USERS
# =====================================================

class UserCreate(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    email: EmailStr
    role: Role = "employee"
    temporary_password: str = Field(min_length=6)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: int
    first_name: str
    last_name: str
    email: EmailStr
    role: Role
    must_change_password: bool
    created_at: datetime


# =====================================================
# AUTH
# =====================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str = "bearer"


class SetPasswordResponse(BaseModel):
    user: UserOut
    access_token: str
    token_type: str = "bearer"


class SetPasswordRequest(BaseModel):
    user_id: int
    new_password: str = Field(min_length=8)


# =====================================================
# CATEGORIES
# =====================================================

class CategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    category_id: int
    category_name: str


# =====================================================
# TICKETS
# =====================================================

class TicketCreate(BaseModel):
    user_id: int
    category_id: int
    title: str = Field(min_length=1, max_length=255)
    description: str = Field(min_length=1, max_length=10000)
    other_category: Optional[str] = Field(default=None, max_length=100)

    @field_validator("title", "description")
    @classmethod
    def nonempty_ticket_text(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("This field cannot be blank.")
        return value


class TicketApprove(BaseModel):
    priority: int = Field(ge=1, le=30)


class TicketClaim(BaseModel):
    tech_id: int


class TicketResolve(BaseModel):
    tech_id: int


class TicketOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    ticket_id: int
    user_id: int
    tech_id: Optional[int] = None
    category_id: int
    title: str
    description: str
    other_category: Optional[str] = None
    status: TicketStatus
    priority: Optional[int] = None
    created_at: datetime
    due_date: Optional[datetime] = None
    resolved_at: Optional[datetime] = None


# =====================================================
# COMMENTS
# =====================================================

class CommentCreate(BaseModel):
    author_id: int
    comment_text: str = Field(min_length=1, max_length=10000)

    @field_validator("comment_text")
    @classmethod
    def nonempty_comment(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Comment cannot be blank.")
        return value


class CommentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    comment_id: int
    ticket_id: int
    author_id: int
    comment_text: str
    created_at: datetime

# First-time company installation (not an ordinary user-registration endpoint).
class SetupStatus(BaseModel):
    setup_required: bool
    setup_key_configured: bool


class InitialAdminCreate(BaseModel):
    first_name: str = Field(min_length=1, max_length=255)
    last_name: str = Field(min_length=1, max_length=255)
    email: EmailStr
    password: str = Field(min_length=12, max_length=72)
    setup_key: str = Field(min_length=1)

    @field_validator("first_name", "last_name")
    @classmethod
    def name_is_not_blank(cls, value: str) -> str:
        value = value.strip()
        if not value:
            raise ValueError("Name cannot be blank.")
        return value
