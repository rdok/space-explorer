FROM nginx:1.17-alpine

LABEL maintainer="Rizart Dokollari <***REMOVED***>" \
    version="1.0"

COPY . /workbench
WORKDIR /workbench

RUN apk add yarn \
 && rm -rf /tmp/* /var/cache/apk

RUN yarn install
RUN yarn run build

RUN ls -lat .
RUN ls -lat /us/share/nginx

COPY build /usr/share/nginx/html

RUN rm -rf /workbench \
       && apk del yarn
