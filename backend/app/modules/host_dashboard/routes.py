from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.modules.deps import DbSessionDep
from . import schemas, crud

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
