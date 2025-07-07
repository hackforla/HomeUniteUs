from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.modules.deps import DbSessionDep
from app.core.db import get_db
from . import schemas, crud, models

router = APIRouter()

@router.post("/contact-info")
def submit_contact_info(
    contact_info: schemas.ContactInfoCreate,
    db: DbSessionDep
):
    return crud.create_contact_info(db, contact_info)

@router.get("/contact-info/{contact_id}", response_model=schemas.ContactInfo)
def get_contact_info(contact_id: int, db: DbSessionDep):
    contact = crud.get_contact_info(db, contact_id)
    if not contact:
        raise HTTPException(status_code=404, detail="Contact info not found")
    return contact


def determine_status(record: object, required_fields: list[str]) -> str:
    if not record:
        return "incomplete"
    
    values = [getattr(record, field) for field in required_fields]
    filled = [v is not None and v != "" for v in values]

    if all(filled):
        return "complete"
    elif any(filled):
        return "partial"
    return "incomplete"

@router.get("/completion-status/{user_id}")
def get_completion_status(user_id: int, db: Session = Depends(get_db)):
    status = {}

    contact_info = db.query(models.ContactInfo).filter(models.ContactInfo.user_id == user_id).first()

    contact_required_fields = ["preferred_method", "phone_number"]

    if contact_info and contact_info.preferred_method == "Email":
        contact_required_fields = ["preferred_method"]

    status["Contact Information"] = determine_status(contact_info, contact_required_fields)

    return status
