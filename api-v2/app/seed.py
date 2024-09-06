from core.db import Base, engine
from sqlalchemy import event
from models import Role

INITIAL_ROLES = [
    {"type": "admin"},
    {"type": "guest"},
    {"type": "host"},
    {"type": "coordinator"},
]


# This method receives a table, a connection and inserts data to that table.
def initialize_table(target, connection, **kw):
    for role in INITIAL_ROLES:
        connection.execute(target.insert(), role)
    return


event.listen(Role.__table__, "after_create", initialize_table)


def init_db():
    Base.metadata.create_all(bind=engine, checkfirst=True)