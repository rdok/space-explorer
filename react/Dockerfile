FROM nginx:1.17-alpine

LABEL maintainer="Rizart Dokollari <r.dokollari@gmail.com>" \
    version="1.0"

COPY . /workbench
WORKDIR /workbench

RUN apk add yarn \
 && rm -rf /tmp/* /var/cache/apk

RUN yarn install && yarn run build

COPY build /usr/share/nginx/html

RUN rm -rf /workbench \
       && apk del yarn
