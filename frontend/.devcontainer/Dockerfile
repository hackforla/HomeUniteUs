# using a generic base image since we want to install python, nodejs, etc
FROM mcr.microsoft.com/vscode/devcontainers/base:dev-bullseye

# use latest available system package listings and installations
RUN sudo apt-get update -y && sudo apt-get upgrade -y

# we need `curl` to download things, and `build-essential` to 
#   install python and node from source
RUN sudo apt-get install -y \
    curl \
    build-essential

# keep dependency installation resources separate from source
WORKDIR /opt

# intall nodejs from prebuilt binaries
#    this approach avoids an issue with other provided installation steps
#    using Node/Vercel tools and scripts, namely surrounding the execution
#    of `source` and `.` commands during a Docker build
RUN curl -LO https://nodejs.org/dist/v20.17.0/node-v20.17.0-linux-x64.tar.xz \
    && tar xJf node-v20.17.0-linux-x64.tar.xz \
    && cd node-v20.17.0-linux-x64 \
    && cp -r ./bin/* /usr/local/bin/ \
    && cp -r ./lib/* /usr/local/lib/ \
    && cp -r ./share/* /usr/local/share/ \
    && cd ..
