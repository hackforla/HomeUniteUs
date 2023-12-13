# TODO: Run the openapi_server with nginx as reverse proxy and gunicorn as WSGI server
FROM python:3.10-alpine

RUN apk update && apk add build-base

RUN mkdir -p /opt/HomeUniteUs/api
WORKDIR /opt/HomeUniteUs/api

COPY . .

RUN python -m pip install --upgrade pip
RUN python -m pip install --no-cache-dir -r requirements-dev.txt

EXPOSE 8080
ENTRYPOINT ["python"]
CMD ["-m", "openapi_server"]
