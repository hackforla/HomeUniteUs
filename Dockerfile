FROM node as bundleBuilder

COPY app /app
WORKDIR /app
RUN npm install
RUN npm run build:docker
ENTRYPOINT ["/bin/bash"]

FROM mongo:latest

RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y python3-pip \
    python3-dev \
    build-essential \
    libssl-dev \
    libffi-dev \
    python3-setuptools

WORKDIR /app

COPY hosthome.py .  
COPY wsgi.py .  
COPY requirements.txt .
RUN pip3 install -r requirements.txt


COPY ./startup.sh .
RUN chmod +x ./startup.sh

COPY --from=bundleBuilder /app/dist ./dist


EXPOSE 80

ENTRYPOINT ["/bin/bash", "-c", "/app/startup.sh"]
