FROM node:10-slim

LABEL MAINTAINER TAOGE


ENV NODE_ENV production
ENV BROWSERLESS_HOST browserless:3000
ENV TZ Asia/Shanghai


RUN ln -sf /bin/bash /bin/sh

RUN apt-get update && apt-get install -yq libgconf-2-4 apt-transport-https git dumb-init --no-install-recommends && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json  /app/

RUN npm install

COPY . /app

EXPOSE 8080
ENTRYPOINT ["dumb-init", "--"]

CMD ["npm", "run", "start"]