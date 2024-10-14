#!/bin/bash

pushd /opt/huu
    ./venv/bin/poetry run fastapi run app/main.py --port 8000 &
popd

/docker-entrypoint.sh nginx -g 'daemon off;'