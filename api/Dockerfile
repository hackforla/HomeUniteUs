# TODO: Run the openapi_server with nginx as reverse proxy and gunicorn as WSGI server
FROM python:3.10-alpine

RUN apk update && apk add build-base && apk add curl

RUN mkdir -p /opt/HomeUniteUs/api
WORKDIR /opt/HomeUniteUs/api

COPY . .

RUN python -m pip install --upgrade pip
RUN python -m pip install --no-cache-dir -r requirements-dev.txt

EXPOSE 8080
ENTRYPOINT ["/bin/sh", "-c"]
# We can decrease the number of health checks when 
# v25.0 docker engine is release. This engine will
# provide a --start-interval option that allows a custom
# startup health check interval
HEALTHCHECK --interval=5s --timeout=5s --retries=3 \
    CMD curl --fail http://${HOST:-localhost}:${PORT:-8080}/api/health || exit 1
CMD ["python -m openapi_server"]
