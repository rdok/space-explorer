FROM node:12-alpine

LABEL maintainer="Rizart Dokollari <r.dokollari@gmail.com>" \
    version="1.0"

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production

COPY . /app

RUN yarn install --production

ENTRYPOINT ["yarn", "run", "production"]
