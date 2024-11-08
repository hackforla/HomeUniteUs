from app.core.db import Base
from app.core.config import get_settings

import app.modules.access.models
import app.modules.intake_profile.models
import app.modules.intake_profile.forms.models
import app.modules.onboarding.models
import app.modules.matching.models
import app.modules.relationship_management.models
import app.modules.tenant_housing_orgs.models
# import app.modules.workflow.models
import app.projections.dashboard_users_view
import app.core.sa_event_store

from logging.config import fileConfig

from sqlalchemy import create_engine

from alembic import context

import sys
import os

print(os.getcwd())
sys.path.append(os.getcwd())

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

database_url = get_settings().DATABASE_URL


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    context.configure(
        url=database_url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    print("ONLINE")
    # Check for an existing connection before creating a new engine.
    # pytest-alembic will hook into alembic by creating a connection
    # with the test engine configuration.
    connectable = context.config.attributes.get("connection", None)
    if connectable is None:
        connectable = create_engine(database_url)

    with connectable.connect() as connection:
        context.configure(connection=connection,
                          target_metadata=target_metadata)

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
