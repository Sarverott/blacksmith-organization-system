FROM alpine:3.17
RUN apk add nodejs>20.11.0 npm>9.1.0 py3-pip>22.3.0 --no-cache

COPY ./config /config
COPY ./package.json /package.json

RUN npm install

COPY ./src /src
COPY ./config/repositories /etc/apk/repositories

WORKDIR /app

