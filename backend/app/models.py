from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Enum,
    Boolean,
    TIMESTAMP,
    DateTime,
    ForeignKey,
    CheckConstraint,
    func,
)
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, autoincrement=True)

    first_name = Column(String(255), nullable=False)
    last_name = Column(String(255), nullable=False)

    email = Column(String(255), unique=True, nullable=False)

    # Store the HASHED password, never the plain-text password
    password_hash = Column(String(255), nullable=False)

    role = Column(
        Enum("employee", "technician", "admin", name="user_role"),
        nullable=False,
        default="employee",
    )

    must_change_password = Column(Boolean, nullable=False, default=True)

    created_at = Column(TIMESTAMP, server_default=func.now())

    tickets_submitted = relationship(
        "Ticket",
        foreign_keys="Ticket.user_id",
        back_populates="submitter",
    )

    tickets_assigned = relationship(
        "Ticket",
        foreign_keys="Ticket.tech_id",
        back_populates="technician",
    )

    comments = relationship("Comment", back_populates="author")


class Category(Base):
    __tablename__ = "categories"

    category_id = Column(Integer, primary_key=True, autoincrement=True)
    category_name = Column(String(255), unique=True, nullable=False)

    tickets = relationship("Ticket", back_populates="category")


class Ticket(Base):
    __tablename__ = "tickets"

    ticket_id = Column(Integer, primary_key=True, autoincrement=True)

    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    tech_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    category_id = Column(Integer, ForeignKey("categories.category_id"), nullable=False)

    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    status = Column(
        Enum("pending", "open", "in_progress", "resolved", "rejected", name="ticket_status"),
        nullable=False,
        default="pending",
    )

    # NULL while waiting for admin review, otherwise 1-5
    priority = Column(Integer, nullable=True)

    created_at = Column(TIMESTAMP, server_default=func.now())
    due_date = Column(DateTime, nullable=True)
    resolved_at = Column(DateTime, nullable=True)

    submitter = relationship("User", foreign_keys=[user_id], back_populates="tickets_submitted")
    technician = relationship("User", foreign_keys=[tech_id], back_populates="tickets_assigned")
    category = relationship("Category", back_populates="tickets")

    comments = relationship(
        "Comment",
        back_populates="ticket",
        order_by="Comment.created_at",
        cascade="all, delete-orphan",
    )

    __table_args__ = (
        CheckConstraint(
            "priority IS NULL OR priority BETWEEN 1 AND 30",
            name="chk_ticket_priority",
        ),
    )


class Comment(Base):
    __tablename__ = "comments"

    comment_id = Column(Integer, primary_key=True, autoincrement=True)

    ticket_id = Column(Integer, ForeignKey("tickets.ticket_id"), nullable=False)
    author_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)

    comment_text = Column(Text, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())

    ticket = relationship("Ticket", back_populates="comments")
    author = relationship("User", back_populates="comments")