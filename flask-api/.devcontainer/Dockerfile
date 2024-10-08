# using a generic base image since we want to install python, nodejs, etc
FROM mcr.microsoft.com/vscode/devcontainers/base:dev-bullseye

# use latest available system package listings and installations
RUN sudo apt-get update -y && sudo apt-get upgrade -y

# we need `curl` to download things, and `build-essential` to 
#   install python and node from source
RUN sudo apt-get install -y \
    curl \
    build-essential \
    libsqlite3-dev \
    libpq-dev

# these packages currently using 3.9 as latest available,
#   ideally these would be included in the `apt-get` command:
#  - python3
#  - python3-dev

# keep dependency installation resources separate from source
WORKDIR /opt

# download and install python from source
#   as of this writing, the latest package supported by apt is Python 3.9, and
#   this is the simplest way to get Python 3.12+ installed for dev
RUN curl -LO https://www.python.org/ftp/python/3.12.5/Python-3.12.5.tgz \
    && tar xzf Python-3.12.5.tgz \
    && cd Python-3.12.5 \
    && ./configure --enable-loadable-sqlite-extensions  \
    && make \
    && sudo make install \
    && cd ..
