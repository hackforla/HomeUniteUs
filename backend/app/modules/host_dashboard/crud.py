from sqlalchemy.orm import Session
from . import models, schemas

def create_contact_info(db: Session, contact_info: schemas.ContactInfoCreate):
    existing_entry = (
        db.query(models.ContactInfo)
        .filter(models.ContactInfo.user_id == contact_info.user_id)
        .first()
    )

    # Update existing entry
    if existing_entry:
        existing_entry.preferred_method = contact_info.preferred_method
        existing_entry.phone_number = contact_info.phone_number
        db.commit()
        db.refresh(existing_entry)
        return existing_entry

    # Create new entry
    db_entry = models.ContactInfo(
        preferred_method=contact_info.preferred_method,
        phone_number=contact_info.phone_number,
        user_id=contact_info.user_id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

#  Retrieve ContactInfo by its primary key (id).
def get_contact_info(db: Session, contact_id: int):
    return db.query(models.ContactInfo).filter(models.ContactInfo.id == contact_id).first()
