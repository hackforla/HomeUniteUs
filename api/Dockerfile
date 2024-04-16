# TODO: Run the openapi_server with nginx as reverse proxy and gunicorn as WSGI server
FROM python:3.10-alpine

RUN apk update && apk add build-base && apk add curl

RUN mkdir -p /opt/HomeUniteUs/api
WORKDIR /opt/HomeUniteUs/api

COPY . .

RUN python -m pip install --upgrade pip
RUN python -m pip install --no-cache-dir -r requirements-dev.txt
# Create an up-to-date database within the API container
# To-Do: Separate the database to its own container
RUN alembic upgrade head

EXPOSE 8080
ENTRYPOINT ["/bin/sh", "-c"]
HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
    CMD curl --fail http://${HOST:-localhost}:${PORT:-8080}/api/health || exit 1
CMD ["python -m openapi_server"]