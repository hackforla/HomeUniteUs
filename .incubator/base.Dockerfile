ARG NGINX_VERSION=1.27.2
ARG PYTHON_VERSION=3.12.5

FROM nginx:${NGINX_VERSION}

# use latest available system package listings and installations
RUN apt-get update -y && apt-get upgrade -y

# we need `curl` to download things, and `build-essential` to 
#   install python and node from source
RUN apt-get install -y \
    curl \
    build-essential \
    libsqlite3-dev \
    libpq-dev \
    zlib1g-dev

# keep dependency installation resources separate from source
WORKDIR /opt

# download and install python from source
#   as of this writing, the latest package supported by apt is Python 3.9, and
#   this is the simplest way to get Python 3.12+ installed

# download and extract Python source
RUN curl -LO https://www.python.org/ftp/python/${PYTHON_VERSION}/Python-${PYTHON_VERSION}.tgz \
    && tar xzf Python-${PYTHON_VERSION}.tgz

# navigate to root of Python source for installation
WORKDIR /opt/Python-${PYTHON_VERSION}

# build and install Python from source
RUN ./configure --enable-loadable-sqlite-extensions \
    && make \
    && make install

