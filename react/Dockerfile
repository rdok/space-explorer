FROM nginx:1.17-alpine

LABEL maintainer="Rizart Dokollari <r.dokollari@gmail.com>" \
    version="1.0"

RUN apk add yarn \
 && rm -rf /tmp/* /var/cache/apk

WORKDIR /workbench
COPY package.json yarn.lock ./
RUN yarn install

COPY ./*.js /workbench/
COPY src /workbench/src
COPY public /workbench/public

RUN yarn run build && \
      rm -rf /usr/share/nginx/html && \
      mv build /usr/share/nginx/html

RUN rm -rf /workbench \
       && apk del yarn
