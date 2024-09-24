from sqlalchemy import event

from app.modules.access.models import Role

INITIAL_ROLES = [
    {"type": "admin"},
    {"type": "guest"},
    {"type": "host"},
    {"type": "coordinator"},
]


def initialize_table(target, connection, **kw):
    """Initialize a DB table.

    This method receives a table, a connection and inserts data to that table.
    """
    for role in INITIAL_ROLES:
        connection.execute(target.insert(), role)
    return


event.listen(Role.__table__, "after_create", initialize_table)
