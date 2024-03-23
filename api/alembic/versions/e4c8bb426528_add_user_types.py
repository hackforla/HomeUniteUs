"""Add user types

Revision ID: e4c8bb426528
Revises: ec8b1c17739a
Create Date: 2024-03-10 21:47:13.942845

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy import text

# revision identifiers, used by Alembic.
revision = 'e4c8bb426528'
down_revision = 'ec8b1c17739a'
branch_labels = None
depends_on = None

def upgrade() -> None:
    '''
    1. Add one table:
        1. role - Store available application user roles
    2. Prepopulate the role table with four role types: Admin, Host, Guest, Coordinator
    3. Update the user table to add the first, middle, last name, and role_id columns.
      * All existing users will be given the first, last name "UNKNOWN"
      * Assign all existing users to the Guest role.
    4. Drop the host table. 
      * There is no way to map host users back to the user table. We would need a user id foreign 
        key, or at least an email address.
    '''
    role_table = op.create_table('role',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.bulk_insert(role_table,
                   [{'name': 'Admin'},
                    {'name': 'Host'},
                    {'name': 'Guest'},
                    {'name': 'Coordinator'}])
    op.create_index(op.f('ix_role_id'), 'role', ['id'], unique=False)

    conn = op.get_bind()
    guest_role_id = conn.execute(text("SELECT id FROM role WHERE name = 'Guest'")).fetchone()[0]

    with op.batch_alter_table('user', schema=None) as batch_op:
        # Each existing user will get the first and last names "Unknown" by default
        # and they will be assigned to the "Guest" user role.
        batch_op.add_column(sa.Column('first_name', sa.String(length=255), nullable=False, server_default='Unknown'))
        batch_op.add_column(sa.Column('middle_name', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('last_name', sa.String(length=255), nullable=False, server_default='Unknown'))
        batch_op.add_column(sa.Column('role_id', sa.Integer, nullable=False, server_default=str(guest_role_id)))
        batch_op.create_foreign_key('fk_user_role_id', 'role', ['role_id'], ['id'])

    op.drop_table('host')

def downgrade() -> None:
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint('fk_user_role_id', type_='foreignkey')
        batch_op.drop_column('last_name')
        batch_op.drop_column('middle_name')
        batch_op.drop_column('first_name')

    op.drop_index(op.f('ix_role_id'), table_name='role')
    op.drop_table('role')
    op.create_table('host',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
        )
    op.create_index(op.f('ix_host_id'), 'host', ['id'], unique=False)
