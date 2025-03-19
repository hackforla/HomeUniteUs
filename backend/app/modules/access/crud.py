from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
import app.modules.access.models as models
import app.modules.access.schemas as schemas
import logging


logger = logging.getLogger(__name__)

def get_role(db: Session, role: str):
    return db.query(models.Role).filter(models.Role.type == role.lower()).first()

def get_role_by_id(db: Session, role_id: int):
    return db.query(models.Role).filter(models.Role.id == role_id).first()

def get_user(db: Session, email: str) -> models.User:
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user_from_schema(db: Session, user: schemas.UserCreate):
    return create_user(
        db=db,
        email=user.email,
        firstName=user.firstName,
        middleName=user.middleName,
        lastName=user.lastName,
        role=user.role
    )


def create_user(db: Session, user: schemas.UserCreate):
    try:
        role = get_role(db, user.role)
        if role is None:
            logger.error("Invalid role specified during user creation", extra={
                "email": user.email
            })
            raise ValueError("Invalid role")

        db_user = models.User(
            email=user.email,
            firstName=user.firstName,
            middleName=user.middleName,
            lastName=user.lastName,
            roleId=role.id,
        )

        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        return db_user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error("Database error during user creation", extra={
            "error": str(e)
        })
        raise

def delete_user(db: Session, user_id: int):
    try:
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if user is None:
            return None
        db.delete(user)
        db.commit()
        return user
    except SQLAlchemyError as e:
        db.rollback()
        logger.error("Database error during user deletion", extra={
            "error": str(e)
        })
        raise