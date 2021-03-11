from sqlalchemy.orm import Session

import models


def get_host(db: Session, host_id: int):
    return db.query(models.Host).filter(models.Host.id == host_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.Host).filter(models.Host.email == email).first()


def get_hosts(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Host).offset(skip).limit(limit).all()
