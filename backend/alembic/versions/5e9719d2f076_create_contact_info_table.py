"""create contact_info table

Revision ID: 009fe89fbb99
Revises: a1a53aaf81d3
Create Date: 2025-06-20 00:54:00.883606

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '009fe89fbb99'
down_revision = 'a1a53aaf81d3'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'contact_info',
        sa.Column('id', sa.Integer, primary_key=True, autoincrement=True),
        sa.Column('preferred_method', sa.String(length=50), nullable=False),
        sa.Column('phone_number', sa.String(length=20), nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.text('CURRENT_TIMESTAMP'), nullable=False),
    )


def downgrade():
    op.drop_table('contact_info')