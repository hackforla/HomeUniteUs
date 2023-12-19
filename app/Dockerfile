# Named temprorary image to build client bundles
FROM node:lts-alpine as builder
ARG VITE_HUU_API_BASE_URL
ENV VITE_HUU_API_BASE_URL=${VITE_HUU_API_BASE_URL}

# do all copies/builds within a subdirectory
WORKDIR /app

# move source files into image
COPY . ./

# Only install non-development dependencies
RUN npm install

# generate bundles from source
RUN npm run build

# Testing image
FROM cypress/base as development
WORKDIR /app

# Copy built assets and all source files from builder
COPY --from=builder /app .
RUN npx cypress install
ENTRYPOINT ["/bin/sh", "-c"]
CMD ["npx vite --host"]

# Runtime image
FROM nginx as production

# Copy client build to runtime image
COPY --from=builder /app/dist /usr/share/nginx/html/

# Override default configuration if available
RUN if [ -e "nginx.conf" ]; then \
        cp nginx.conf /etc/nginx/nginx.conf; \
    fi

# Default nginx runs on port 80, but we will 
#    publish to a different port at Docker 
#    runtime environment level
EXPOSE 80
ENTRYPOINT ["/bin/sh", "-c"]
