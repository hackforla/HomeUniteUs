from sqlalchemy.orm import Session

import app.modules.access.models as models
import app.modules.access.schemas as schemas


def get_role(db: Session, role: int):
    return db.query(models.Role).filter(models.Role.type == role.value).first()


def get_user(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def create_user(db: Session, user: schemas.UserCreate):
    role = get_role(db, user.role)
    if role is None:
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


def delete_user(db: Session, user_id: int):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    db.delete(user)
    db.commit()
    return user
