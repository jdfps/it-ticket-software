from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db

router = APIRouter(prefix="/tickets", tags=["tickets"])


def _get_ticket_or_404(ticket_id: int, db: Session) -> models.Ticket:
    ticket = db.query(models.Ticket).filter(models.Ticket.ticket_id == ticket_id).first()

    if not ticket:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Ticket not found.",
        )

    return ticket


@router.post("", response_model=schemas.TicketOut, status_code=status.HTTP_201_CREATED)
def create_ticket(payload: schemas.TicketCreate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.user_id == payload.user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

    category = (
        db.query(models.Category)
        .filter(models.Category.category_id == payload.category_id)
        .first()
    )
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found.")

    ticket = models.Ticket(
        user_id=payload.user_id,
        category_id=payload.category_id,
        title=payload.title.strip(),
        description=payload.description.strip(),
        status="pending",
    )

    db.add(ticket)
    db.commit()
    db.refresh(ticket)

    return ticket


@router.get("", response_model=List[schemas.TicketOut])
def list_tickets(
    ticket_status: Optional[str] = None,
    user_id: Optional[int] = None,
    tech_id: Optional[int] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Ticket)

    if ticket_status:
        query = query.filter(models.Ticket.status == ticket_status)
    if user_id is not None:
        query = query.filter(models.Ticket.user_id == user_id)
    if tech_id is not None:
        query = query.filter(models.Ticket.tech_id == tech_id)

    return query.order_by(models.Ticket.created_at.desc()).all()


@router.get("/{ticket_id}", response_model=schemas.TicketOut)
def get_ticket(ticket_id: int, db: Session = Depends(get_db)):
    return _get_ticket_or_404(ticket_id, db)


@router.patch("/{ticket_id}/approve", response_model=schemas.TicketOut)
def approve_ticket(
    ticket_id: int,
    payload: schemas.TicketApprove,
    db: Session = Depends(get_db),
):
    ticket = _get_ticket_or_404(ticket_id, db)

    if ticket.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending tickets can be approved.",
        )

    approved_at = datetime.utcnow()

    ticket.status = "open"
    ticket.priority = payload.priority
    ticket.due_date = approved_at + timedelta(days=payload.priority)

    db.commit()
    db.refresh(ticket)

    return ticket


@router.patch("/{ticket_id}/reject", response_model=schemas.TicketOut)
def reject_ticket(ticket_id: int, db: Session = Depends(get_db)):
    ticket = _get_ticket_or_404(ticket_id, db)

    if ticket.status != "pending":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only pending tickets can be rejected.",
        )

    ticket.status = "rejected"

    db.commit()
    db.refresh(ticket)

    return ticket


@router.patch("/{ticket_id}/claim", response_model=schemas.TicketOut)
def claim_ticket(
    ticket_id: int,
    payload: schemas.TicketClaim,
    db: Session = Depends(get_db),
):
    ticket = _get_ticket_or_404(ticket_id, db)

    technician = (
        db.query(models.User)
        .filter(models.User.user_id == payload.tech_id)
        .first()
    )
    if not technician or technician.role != "technician":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid technician.",
        )

    if ticket.status != "open" or ticket.tech_id is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Ticket is not available to claim.",
        )

    ticket.status = "in_progress"
    ticket.tech_id = payload.tech_id

    db.commit()
    db.refresh(ticket)

    return ticket


@router.patch("/{ticket_id}/resolve", response_model=schemas.TicketOut)
def resolve_ticket(
    ticket_id: int,
    payload: schemas.TicketResolve,
    db: Session = Depends(get_db),
):
    ticket = _get_ticket_or_404(ticket_id, db)

    if ticket.tech_id != payload.tech_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the assigned technician can resolve this ticket.",
        )

    if ticket.status != "in_progress":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only in-progress tickets can be resolved.",
        )

    ticket.status = "resolved"
    ticket.resolved_at = datetime.utcnow()

    db.commit()
    db.refresh(ticket)

    return ticket