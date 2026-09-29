from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/tickets/{ticket_id}/comments", tags=["comments"])


def _get_ticket_or_404(ticket_id: int, db: Session) -> models.Ticket:
    ticket = db.query(models.Ticket).filter(models.Ticket.ticket_id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found.",
        )

    return ticket


@router.get("", response_model=List[schemas.CommentOut])
def list_comments(ticket_id: int, db: Session = Depends(get_db)):
    _get_ticket_or_404(ticket_id, db)

    return (
        db.query(models.Comment)
        .filter(models.Comment.ticket_id == ticket_id)
        .order_by(models.Comment.created_at)
        .all()
    )


@router.post("", response_model=schemas.CommentOut, status_code=status.HTTP_201_CREATED)
def create_comment(
    ticket_id: int,
    payload: schemas.CommentCreate,
    db: Session = Depends(get_db),
):
    _get_ticket_or_404(ticket_id, db)

    author = db.query(models.User).filter(models.User.user_id == payload.author_id).first()
    if not author:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found.")

    comment = models.Comment(
        ticket_id=ticket_id,
        author_id=payload.author_id,
        comment_text=payload.comment_text.strip(),
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment