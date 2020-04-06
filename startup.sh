#!/bin/sh
echo "starting hosthome.."
cd /app
gunicorn --log-level=debug --bind=0.0.0.0:80 wsgi
