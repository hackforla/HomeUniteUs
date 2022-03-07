# Named temprorary image to build client bundles
FROM node:lts-alpine as builder

# do all copies/builds within a subdirectory
WORKDIR /app

# move source files into image
COPY . ./

# client package install
RUN npm install

# secrets
COPY .env .

# generate bundles from source
RUN npm run build

# Runtime image
FROM nginx

# Copy client build to runtime image
COPY --from=builder /app/dist /usr/share/nginx/html/

# Override default configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Default nginx runs on port 80, but we will 
#    publish to a different port at Docker 
#    runtime environment level
EXPOSE 80

