# Temprorary image to build client bundles

# Name the base image for future reference
FROM node as bundleBuilder

# move source files into image
COPY app /app

# do all copies/builds within a subdirectory
WORKDIR /app

# client package install
RUN npm install

# secrets
COPY .env .

# generate bundles from source
RUN npm run build:docker

# END Temporary image

# comes with mongo deps, still will need Flask deps
FROM mongo:latest

# install flask deps, i.e. python and ssl libs
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y python3-pip \
    python3-dev \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-setuptools

WORKDIR /app

COPY requirements.txt .
RUN pip3 install -r requirements.txt

# do all copies/builds within application's subdirectory
WORKDIR /hosthome

# secrets
COPY .env .

# Server source and launch script, set perms
COPY *.py ./
COPY ./startup.sh .
COPY ./initMongo.js .
COPY ./data/seed/*.json /var/tmp/
COPY ./data ./data
COPY ./blueprints ./blueprints
COPY ./config ./config
RUN chmod +x ./startup.sh

# get client bundles from temporary image
# COPY --from=bundleBuilder /app/dist ./app/dist
COPY  ./app/dist ./app/dist

# tell Docker to allow traffic to reach this port
EXPOSE 5678

RUN dos2unix /hosthome/startup.sh

# run a shell when the container starts (script to configure and launch the app server)
ENTRYPOINT ["/bin/bash", "-c", "/hosthome/startup.sh"]
