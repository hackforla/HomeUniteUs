# TODO: Remove .env from docker container
# TODO: Install openapi_server not as editable
# TODO: Run the openapi_server with nginx as reverse proxy and gunicorn as WSGI server
FROM python:3.10-alpine

RUN apk update && apk add build-base

RUN mkdir -p /opt/HomeUniteUs/api
WORKDIR /opt/HomeUniteUs/api

COPY . .

COPY --from=swagger-bundle /usr/share/misc/openapi.yaml openapi_server/_spec/openapi.yaml

ARG PSEUDO_VERSION=1
ENV SETUPTOOLS_SCM_PRETEND_VERSION_FOR_OPENAPI_SERVER=${PSEUDO_VERSION}
RUN python3 -m pip install -e .

EXPOSE 8080

RUN export $(grep -v '^#' .env | xargs -d '\n')

ENTRYPOINT ["python3"]

CMD ["-m", "openapi_server"]
