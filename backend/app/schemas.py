from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field, ConfigDict

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
    title: str = Field(min_length=1)
    description: str = Field(min_length=1)


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
    comment_text: str = Field(min_length=1)


class CommentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    comment_id: int
    ticket_id: int
    author_id: int
    comment_text: str
    created_at: datetime