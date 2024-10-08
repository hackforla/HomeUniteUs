#!/bin/bash

pushd /opt/huu
gunicorn -w 4 -k uvicorn.workers.UvicornWorker main:app &
popd

/docker-entrypoint.sh nginx -g 'daemon off;'