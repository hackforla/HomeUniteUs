"""Shared database components."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

_db_engine = None
_DbSessionFactory = None


class Base(DeclarativeBase):
    pass


def init_db(engine):
    Base.metadata.create_all(bind=engine, checkfirst=True)


def db_engine(settings):
    global _db_engine
    if _db_engine is None:
        _db_engine = create_engine(settings.DATABASE_URL,
                                   connect_args={"check_same_thread": False})
    return _db_engine


def db_session_factory(engine):
    global _DbSessionFactory
    if _DbSessionFactory is None:
        _DbSessionFactory = sessionmaker(autocommit=False,
                                         autoflush=False,
                                         bind=engine)
    return _DbSessionFactory
