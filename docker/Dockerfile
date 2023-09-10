# syntax=docker/dockerfile:1

FROM ubuntu:latest

ENV NODE_VERSION 18.17.1
ENV MACHINE_GUID 1234567890
ENV PROJECT_GUID 1234567890
ENV AWS_ACCESS_KEY_ID 1234567890
ENV AWS_SECRET_ACCESS_KEY 1234567890

# Replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN DOCKER_BUILDKIT=0
# Set debconf to run non-interactively
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install base dependencies
RUN apt-get update && apt-get install -y -q --no-install-recommends \
    apt-transport-https \
    build-essential \
    ca-certificates \
    curl \
    git \
    libssl-dev \
    wget \
    && rm -rf /var/lib/apt/lists/*
ENV NVM_DIR /.nvm 
RUN mkdir $NVM_DIR
# or /usr/local/nvm,~/.nvm , depending

# Install nvm with node and npm
#RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh
RUN curl https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
ENV NODE_MODULES $NVM_DIR/versions/node/v$NODE_VERSION/lib/node_modules
ENV NODE_PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin/
RUN chmod -R 777 $NVM_DIR
RUN [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" 
# This loads nvm
#RUN ls -la $NVM_DIR
RUN $NVM_DIR/nvm.sh install $NODE_VERSION
RUN $NVM_DIR/nvm.sh alias default $NODE_VERSION
RUN $NVM_DIR/nvm.sh use default
ENV PATH=$NODE_MODULES:$NODE_PATH:$NVM_DIR/bin:$NVM_DIR:$PATH
RUN echo "export PATH=/new/path:${PATH}" >> /root/.bashrc
RUN . /root/.bashrc
RUN echo $PATH
RUN node --version
RUN npm --version
#COPY PROJECT
RUN mkdir /jslt-scripts
RUN mkdir /jslt-scripts/project
RUN chmod -R 777 /jslt-scripts
RUN mkdir /jslt-scripts/client
ADD ./client /jslt-scripts/
RUN ls -la /jslt-scripts/client
#Install dependencies
RUN cd /jslt-scripts/client && npm i
RUN mkdir ~/.aws

ENTRYPOINT cd /jslt-scripts/client && node --preserve-symlinks -r ts-node/register .\main.ts $MACHINE_GUID $PROJECT_GUID $AWS_ACCESS_KEY_ID $AWS_SECRET_ACCESS_KEY && /bin/bash

# FROM node:18-alpine
# WORKDIR /app
# COPY . .
# RUN yarn install --production
# CMD ["node", "src/index.js"]
# EXPOSE 3000