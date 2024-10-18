"""Shared database components."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from sqlalchemy.types import JSON

from typing import Any

_db_engine = None
_DbSessionFactory = None


class Base(DeclarativeBase):
    type_annotation_map = {dict[str, Any]: JSON}


def init_db(engine):
    if engine is None:
        raise Exception("db engine does not exist")
    Base.metadata.create_all(bind=engine, checkfirst=True)


def db_engine(settings):
    global _db_engine
    if _db_engine is None:
        _db_engine = create_engine(settings.DATABASE_URL)
    return _db_engine


def db_session_factory(engine):
    global _DbSessionFactory
    if _DbSessionFactory is None:
        _DbSessionFactory = sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine)
    return _DbSessionFactory
