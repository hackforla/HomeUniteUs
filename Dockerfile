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
RUN npm run build
