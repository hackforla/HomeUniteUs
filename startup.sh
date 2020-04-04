#!/bin/sh
echo "starting hosthome.."
cd /app
gunicorn -b 0.0.0.0:80 wsgi
