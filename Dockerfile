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

# Server image for MongoDB+Flask
FROM host-home-base

# do all copies/builds within application's subdirectory
WORKDIR /app

# secrets
COPY .env .

# Server source and launch script, set perms
COPY *.py ./
COPY ./startup.sh .
COPY ./initMongo.js .
COPY data/*.json /var/tmp/
RUN chmod +x ./startup.sh

# get client bundles from temporary image
COPY --from=bundleBuilder /app/dist ./dist

# tell Docker to allow traffic to reach this port
EXPOSE 80

# run a shell when the container starts (script to configure and launch the app server)
ENTRYPOINT ["/bin/bash", "-c", "/app/startup.sh"]
