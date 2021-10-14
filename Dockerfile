# Temprorary image to build client bundles

# Name the base image for future reference
FROM node as client

# move source files into image
COPY app /app

# do all copies/builds within a subdirectory
WORKDIR /app

# secrets
COPY .env .

# client package install and generate bundles from source
RUN npm install && npm run build

# runtime image
FROM nginxinc/nginx-unprivileged as nginx

# move the client distribution to its location
COPY --from=client /app/dist /usr/share/nginx/html

# create site configuration
# COPY nginx.conf /etc/nginx/sites-available/homeunite.us
