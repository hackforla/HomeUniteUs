from sqlalchemy import event

from app.modules.access.models import Role

INITIAL_ROLES = [
    {"role": "admin"},
    {"role": "guest"},
    {"role": "host"},
    {"role": "coordinator"},
]


def initialize_table(target, connection, **kw):
    """Initialize a DB table.

    This method receives a table, a connection and inserts data to that table.
    """
    for role in INITIAL_ROLES:
        connection.execute(target.insert(), role)
    return


event.listen(Role.__table__, "after_create", initialize_table)
