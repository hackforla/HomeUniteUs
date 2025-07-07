"""Add user_id to contact_info

Revision ID: 24116d95dda6
Revises: 009fe89fbb99
Create Date: 2025-07-04 16:11:29.182946

"""
from alembic import op
import sqlalchemy as sa

revision = '24116d95dda6'
down_revision = '009fe89fbb99'
branch_labels = None
depends_on = None

def upgrade():
    op.add_column('contact_info', sa.Column('user_id', sa.Integer(), nullable=True))
    
    op.create_foreign_key(
        'fk_contact_info_user_id',  
        'contact_info',             
        'user',                    
        ['user_id'],                
        ['id'],                    
        ondelete='CASCADE'          
    )

def downgrade():
    op.drop_constraint('fk_contact_info_user_id', 'contact_info', type_='foreignkey')
    op.drop_column('contact_info', 'user_id')