"""first_forms_api

Revision ID: 4f86de253491
Revises: e4c8bb426528
Create Date: 2024-04-28 20:29:57.931911

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4f86de253491'
down_revision = 'e4c8bb426528'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table('field_properties',
    sa.Column('properties_id', sa.Integer(), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('field_type', sa.String(length=50), nullable=False),
    sa.Column('choices', sa.JSON(), nullable=True),
    sa.Column('field_group', sa.JSON(), nullable=True),
    sa.CheckConstraint("field_type IN ('date', 'dropdown', 'multiple_choice', 'email', 'file_upload', 'group', 'long_text', 'number', 'short_text', 'yes_no')", name='chk_field_type'),
    sa.PrimaryKeyConstraint('properties_id')
    )
    op.create_table('field_validations',
    sa.Column('validations_id', sa.Integer(), nullable=False),
    sa.Column('required', sa.Boolean(), nullable=False),
    sa.Column('max_length', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('validations_id')
    )
    op.create_table('forms',
    sa.Column('form_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('form_id')
    )
    op.create_table('field_groups',
    sa.Column('group_id', sa.Integer(), nullable=False),
    sa.Column('form_id', sa.Integer(), nullable=False),
    sa.Column('title', sa.String(length=255), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['form_id'], ['forms.form_id'], ),
    sa.PrimaryKeyConstraint('group_id')
    )
    op.create_table('fields',
    sa.Column('field_id', sa.String(length=255), nullable=False),
    sa.Column('form_id', sa.Integer(), nullable=False),
    sa.Column('ref', sa.String(length=255), nullable=False),
    sa.Column('properties_id', sa.Integer(), nullable=False),
    sa.Column('validations_id', sa.Integer(), nullable=False),
    sa.Column('group_id', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['form_id'], ['forms.form_id'], ),
    sa.ForeignKeyConstraint(['group_id'], ['field_groups.group_id'], ),
    sa.ForeignKeyConstraint(['properties_id'], ['field_properties.properties_id'], ),
    sa.ForeignKeyConstraint(['validations_id'], ['field_validations.validations_id'], ),
    sa.PrimaryKeyConstraint('field_id')
    )
    op.create_table('responses',
    sa.Column('answer_id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('field_id', sa.String(length=255), nullable=False),
    sa.Column('answer_text', sa.Text(), nullable=True),
    sa.ForeignKeyConstraint(['field_id'], ['fields.field_id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('answer_id')
    )
    
def downgrade() -> None:
    op.drop_table('responses')
    op.drop_table('fields')
    op.drop_table('field_groups')
    op.drop_table('forms')
    op.drop_table('field_validations')
    op.drop_table('field_properties')
