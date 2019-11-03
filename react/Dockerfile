FROM nginx:1.17-alpine

LABEL maintainer="Rizart Dokollari <r.dokollari@gmail.com>" \
    version="1.0"

RUN apk add yarn \
 && rm -rf /tmp/* /var/cache/apk

COPY package.json package.json
RUN yarn install

COPY . /workbench
WORKDIR /workbench

RUN yarn run build

COPY build /usr/share/nginx/html

RUN rm -rf /workbench \
       && apk del yarn
