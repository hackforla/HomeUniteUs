# from sqlalchemy.orm import Session

# import app.modules.access.models as models
# import app.modules.access.schemas as schemas
# import logging

# logger = logging.getLogger(__name__)

# def get_role(db: Session, role: int):
#     return db.query(models.Role).filter(models.Role.type == role.value).first()


# def get_user(db: Session, email: str):
#     return db.query(models.User).filter(models.User.email == email).first()

# def get_user_by_id(db: Session, user_id: int):
#     return db.query(models.User).filter(models.User.id == user_id).first()

# def create_user(db: Session, user: schemas.UserCreate):
#     role = get_role(db, user.role)
#     if role is None:
#         raise ValueError("Invalid role")

#     db_user = models.User(
#         email=user.email,
#         firstName=user.firstName,
#         middleName=user.middleName,
#         lastName=user.lastName,
#         roleId=role.id,
#     )

#     db.add(db_user)
#     db.commit()
#     db.refresh(db_user)
#     return db_user


# def delete_user(db: Session, user_id: int):
#     user = db.query(models.User).filter(models.User.id == user_id).first()
#     db.delete(user)
#     db.commit()
#     return user

from sqlalchemy.orm import Session
import logging

import app.modules.access.models as models
import app.modules.access.schemas as schemas

logger = logging.getLogger(__name__)

def get_role(db: Session, role: int):
    try:
        logger.debug(f"Attempting to retrieve role with value: {role.value}")
        role_obj = db.query(models.Role).filter(models.Role.type == role.value).first()
        
        if role_obj is None:
            logger.warning(f"No role found with value: {role.value}")
        else:
            logger.debug(f"Role found: {role_obj.id}")
        
        return role_obj
    except Exception as e:
        logger.error(f"Error retrieving role: {str(e)}", exc_info=True)
        raise

def get_user(db: Session, email: str):
    try:
        logger.debug(f"Attempting to retrieve user with email: {email}")
        user = db.query(models.User).filter(models.User.email == email).first()
        
        if user is None:
            logger.info(f"No user found with email: {email}")
        else:
            logger.debug(f"User found with id: {user.id}")
        
        return user
    except Exception as e:
        logger.error(f"Error retrieving user by email: {str(e)}", exc_info=True)
        raise

def get_user_by_id(db: Session, user_id: int):
    try:
        logger.debug(f"Attempting to retrieve user with ID: {user_id}")
        user = db.query(models.User).filter(models.User.id == user_id).first()
        
        if user is None:
            logger.info(f"No user found with ID: {user_id}")
        else:
            logger.debug(f"User found: {user.email}")
        
        return user
    except Exception as e:
        logger.error(f"Error retrieving user by ID: {str(e)}", exc_info=True)
        raise

def create_user(db: Session, user: schemas.UserCreate):
    try:
        logger.debug(f"Attempting to create user: {user.email}")
        
        role = get_role(db, user.role)
        if role is None:
            logger.error(f"Invalid role attempted for user: {user.email}")
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
        
        logger.info(f"User created successfully: {db_user.email} (ID: {db_user.id})")
        return db_user
    except Exception as e:
        logger.error(f"Error creating user: {str(e)}", exc_info=True)
        db.rollback()
        raise

def delete_user(db: Session, user_id: int):
    try:
        logger.debug(f"Attempting to delete user with ID: {user_id}")
        
        user = db.query(models.User).filter(models.User.id == user_id).first()
        
        if user is None:
            logger.warning(f"No user found with ID {user_id} to delete")
            return None

        db.delete(user)
        db.commit()
        
        logger.info(f"User deleted successfully: {user.email} (ID: {user_id})")
        return user
    except Exception as e:
        logger.error(f"Error deleting user: {str(e)}", exc_info=True)
        db.rollback()
        raise
