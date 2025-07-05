from sqlalchemy.orm import Session
from . import models, schemas

def create_contact_info(db: Session, contact_info: schemas.ContactInfoCreate):
    db_entry = models.ContactInfo(
        preferred_method=contact_info.preferred_method,
        phone_number=contact_info.phone_number,
        user_id=contact_info.user_id
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)
    return db_entry

def get_contact_info(db: Session, contact_id: int):
    return db.query(models.ContactInfo).filter(models.ContactInfo.id == contact_id).first()
