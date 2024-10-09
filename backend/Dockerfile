FROM python:3.12-bookworm AS builder

# --- Install Poetry ---
ARG POETRY_VERSION=1.8

ENV POETRY_HOME=/opt/poetry
ENV POETRY_NO_INTERACTION=1
ENV POETRY_VIRTUALENVS_IN_PROJECT=1
ENV POETRY_VIRTUALENVS_CREATE=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
# Tell Poetry where to place its cache and virtual environment
ENV POETRY_CACHE_DIR=/opt/.cache

RUN pip install "poetry==${POETRY_VERSION}"

WORKDIR /app

# --- Reproduce the environment ---
COPY pyproject.toml .

# Install the dependencies and clear the cache afterwards.
#   This may save some MBs.
RUN poetry install --no-root && rm -rf $POETRY_CACHE_DIR

# Now let's build the runtime image from the builder.
#   We'll just copy the env and the PATH reference.
FROM python:3.12-bookworm AS runtime

ENV VIRTUAL_ENV=/app/.venv
ENV PATH="/app/.venv/bin:$PATH"

COPY --from=builder ${VIRTUAL_ENV} ${VIRTUAL_ENV}

COPY ./alembic /code/alembic
COPY ./alembic.ini /code/alembic.ini
COPY ./app /code/app
COPY ./form_data /code/form_data
COPY ./startup_scripts/entrypoint.sh /code/startup_scripts/entrypoint.sh
COPY ./startup_scripts/setup_moto_server.py /code/startup_scripts/setup_moto_server.py
COPY ./startup_scripts/create_groups_users.py /code/startup_scripts/create_groups_users.py

RUN chmod +x /code/startup_scripts/entrypoint.sh

WORKDIR /code
ENTRYPOINT ["/code/startup_scripts/entrypoint.sh"]
CMD []
EXPOSE 8000