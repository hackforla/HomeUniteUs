"""Shared database components."""
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.types import JSON
from typing import Any, Generator
from fastapi import Depends
import logging

from app.core.config import get_settings

logger = logging.getLogger(__name__)

_db_engine = None
_DbSessionFactory = None


class Base(DeclarativeBase):
    type_annotation_map = {dict[str, Any]: JSON}


def init_db(engine):
    if engine is None:
        logger.error("Database engine initialization failed: engine is None")
        raise Exception("db engine does not exist")
    
    try:
        Base.metadata.create_all(bind=engine, checkfirst=True)
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
    except Exception as e:
        logger.error("Database initialization failed", extra={
            "error": str(e),
            "error_type": type(e).__name__
        })
        raise


def db_engine(settings) -> "Engine":
    global _db_engine
    if _db_engine is None:
        try:
            _db_engine = create_engine(settings.DATABASE_URL)
        except Exception as e:
            logger.error("Failed to create database engine", extra={
                "error": str(e),
                "error_type": type(e).__name__
            })
            raise
    return _db_engine


def db_session_factory(engine) -> sessionmaker:
    global _DbSessionFactory
    if _DbSessionFactory is None:
        try:
            _DbSessionFactory = sessionmaker(
                autocommit=False,
                autoflush=False,
                bind=engine
            )
        except Exception as e:
            logger.error("Failed to create session factory", extra={
                "error": str(e),
                "error_type": type(e).__name__
            })
            raise
    return _DbSessionFactory


def get_db(settings = Depends(get_settings)) -> Generator:
    """
    FastAPI dependency that provides a SQLAlchemy Session.
    """
    engine = db_engine(settings)
    SessionLocal = db_session_factory(engine)
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
