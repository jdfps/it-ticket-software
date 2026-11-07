from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_db
from app.authentication import require_roles

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=List[schemas.CategoryOut])
def list_categories(db: Session = Depends(get_db), current_user: models.User = Depends(require_roles("admin", "technician", "employee"))):
    return db.query(models.Category).order_by(models.Category.category_id).all()