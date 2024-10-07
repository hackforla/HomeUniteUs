#!/bin/bash

# Export environment variables if .env file exists.
# This is only needed when running this script on a host.
if [ -r .env ]; then
    dotenv list --format export > envfile
    source envfile
    rm envfile
fi

# Alembic migration
alembic upgrade head

# Setup moto server and export Cognito environment variables
python startup_scripts/setup_moto_server.py > envfile
source envfile
rm envfile

# Create test users in moto server and postgres
python startup_scripts/create_groups_users.py

if [ "$1" == "prod" ]; then
    fastapi run app/main.py --port 8000
else
    fastapi dev
fi
