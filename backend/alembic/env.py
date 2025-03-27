from logging.config import fileConfig
from sqlalchemy import String, engine_from_config
from sqlalchemy import pool
from alembic import context
import sqlmodel
from sqlmodel import SQLModel
from dotenv import load_dotenv
import os

# Load environment variables from the .env file
load_dotenv()

# Get the environment variables for database connection
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

# Build the DATABASE_URL dynamically
DATABASE_URL = f"postgresql+psycopg://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Configure alembic to use the dynamically built URL
config = context.config
config.set_main_option("sqlalchemy.url", DATABASE_URL)

# Interpret the config file for Python logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Import the models
from app.v1.models import all_models  # Ensure all models are registered in __init__.py

# Set the SQLModel metadata as the target
target_metadata = SQLModel.metadata

# Fix for the AutoString type
def render_item(type_, obj, autogen_context):
    """Apply custom rendering for AutoString type."""
    if type_ == "type" and isinstance(obj, sqlmodel.sql.sqltypes.AutoString):
        # Render the AutoString type as a SQLAlchemy String
        return "sa.String()"
    # For all other cases, use the default rendering
    return False


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL and not an Engine.
    By skipping the Engine creation, we don't need a DBAPI to be available.

    Calls to context.execute() emit the given string to the script output.
    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_item=render_item,
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario, we need to create an Engine and associate a connection
    with the context.
    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            render_item=render_item,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
