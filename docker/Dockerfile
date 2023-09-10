# syntax=docker/dockerfile:1
FROM ubuntu:latest
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
ENV NODE_VERSION 18.17.1

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
ADD ./tryme/ /jslt-scripts/project/
RUN cd /jslt-scripts/project
RUN ls -la /jslt-scripts/project
#Install dependencies
RUN cd /jslt-scripts/project && npm i
RUN cd /jslt-scripts/project && node main.js

# FROM node:18-alpine
# WORKDIR /app
# COPY . .
# RUN yarn install --production
# CMD ["node", "src/index.js"]
# EXPOSE 3000