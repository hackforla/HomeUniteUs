ARG NODE_VERSION=20.18.0-bookworm
ARG HUU_BASE_VERSION=1.0
ARG HUU_ECR_REPOSITORY=035866691871.dkr.ecr.us-west-2.amazonaws.com/homeuniteus

# use the official Node image for building the UI bundle
FROM node:${NODE_VERSION} as client-builder


# navigate to dir where client app source and build will live
WORKDIR /app

# copy the UI source code and configurations into our working dir
COPY ./frontend ./

# install the NPM packages and generate the UI build
RUN npm install && npm run build

# use our custom base image with pre-installed Python
#    note: if we adjust to work with a common stable
#      version of Python (i.e. latest available package 
#      for distro), then we should merge the base image
#      dockerfile here and install directly
FROM ${HUU_ECR_REPOSITORY}:base-${HUU_BASE_VERSION}

# expose parameters for custom configuration of build SDK/runtime versions
#    and build process configurations
ARG POETRY_VERSION=1.8
ARG HUU_TARGET_ENV=qa

# navigate to dir where API sources and scripts will live
WORKDIR /opt/huu

# copy the API source into our working dir
COPY ./backend ./

# set some env vars to configure poetry behavior
ENV POETRY_HOME=/opt/poetry
ENV POETRY_NO_INTERACTION=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Tell Poetry where to place its cache and virtual environment
ENV POETRY_CACHE_DIR=/opt/.cache

# install poetry for Python package management
RUN python3 -m pip install "poetry==${POETRY_VERSION}"

# Install the dependencies and clear the cache afterwards.
#   This may save some MBs.
RUN poetry install --no-root && rm -rf $POETRY_CACHE_DIR

# pull our UI build (generated in previous stage) into the conventional
#   location for its nginx `server` block
COPY --from=client-builder /app/dist /var/www/${HUU_TARGET_ENV}.homeunite.us/html/

# overwrite the default nginx `server` block with ours - note that
#   if we ever want to acutally deploy separate server blocks, this
#   file should be deleted in favor of a conf file at:
#     /etc/nginx/sites-available/${HUU_TARGET_ENV}.homeunite.us
#   which should be symlinked to: `/etc/nginx/sites-enabled/`
COPY ./.incubator/default.conf /etc/nginx/conf.d/default.conf

RUN sed -i "s/<HUU_ENVIRONMENT>/${HUU_TARGET_ENV}/g" /etc/nginx/conf.d/default.conf

# add our entrypoint script, which will start the API's `gunicorn` process
#   and fork it into the background, then run the default entrypoint for nginx
COPY ./.incubator/docker-entrypoint.sh /opt/huu/entrypoint.sh

# set the `x` flag to allow execution by the dockerd process
RUN chmod +x /opt/huu/entrypoint.sh

# create the target directory for the nginx access and error logs
RUN mkdir -p /var/log/${HUU_TARGET_ENV}.homeunite.us/
