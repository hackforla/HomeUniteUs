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
    op.create_table('user_roles',
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('role_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['role_id'], ['role.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
        sa.PrimaryKeyConstraint('user_id', 'role_id')
    )

    # Each existing user will get the first and last names "Unknown" by default
    # and they will be assigned to the "Guest" user role.
    op.add_column('user', sa.Column('first_name', sa.String(length=255), nullable=False, server_default='Unknown'))
    op.add_column('user', sa.Column('middle_name', sa.String(length=255), nullable=True))
    op.add_column('user', sa.Column('last_name', sa.String(length=255), nullable=False, server_default='Unknown'))

    conn = op.get_bind()
    guest_role_id = conn.execute(text("SELECT id FROM role WHERE name = 'Guest'")).fetchone()[0]
    existing_user_ids = conn.execute(text("SELECT id from user")).fetchall()
    for user_id in existing_user_ids:
        conn.execute(text(f"INSERT INTO user_roles (user_id, role_id) VALUES ({user_id[0]}, {guest_role_id})"))

    op.drop_table('host')

def downgrade() -> None:
    op.drop_column('user', 'last_name')
    op.drop_column('user', 'middle_name')
    op.drop_column('user', 'first_name')
    op.drop_table('user_roles')
    op.drop_index(op.f('ix_role_id'), table_name='role')
    op.drop_table('role')
    op.create_table('host',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(), nullable=False),
        sa.PrimaryKeyConstraint('id')
        )
