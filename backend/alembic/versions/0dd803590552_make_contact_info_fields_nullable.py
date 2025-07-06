"""make contact_info fields nullable

Revision ID: 0dd803590552
Revises: 24116d95dda6
Create Date: 2025-07-05 10:43:46.785939

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0dd803590552'
down_revision = '24116d95dda6'
branch_labels = None
depends_on = None


def upgrade():
    op.alter_column('contact_info', 'preferred_method',
                    existing_type=sa.String(length=50),
                    nullable=True)
    op.alter_column('contact_info', 'phone_number',
                    existing_type=sa.String(length=20),
                    nullable=True)

def downgrade():
    op.alter_column('contact_info', 'preferred_method',
                    existing_type=sa.String(length=50),
                    nullable=False)
    op.alter_column('contact_info', 'phone_number',
                    existing_type=sa.String(length=20),
                    nullable=False)