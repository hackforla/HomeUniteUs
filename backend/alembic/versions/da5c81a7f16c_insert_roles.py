"""Insert roles

Revision ID: da5c81a7f16c
Revises: 
Create Date: 2024-10-04 19:54:27.920150

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'da5c81a7f16c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.execute("INSERT INTO role (type) VALUES ('admin') ON CONFLICT DO NOTHING")
    op.execute("INSERT INTO role (type) VALUES ('guest') ON CONFLICT DO NOTHING")
    op.execute("INSERT INTO role (type) VALUES ('coordinator') ON CONFLICT DO NOTHING")
    op.execute("INSERT INTO role (type) VALUES ('host') ON CONFLICT DO NOTHING")


def downgrade() -> None:
    pass
