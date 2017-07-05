# vue-cli
FROM node:7-alpine
WORKDIR /app
EXPOSE 8080
VOLUME ["/app/src"]

COPY ./package.json /app
RUN cd /app && npm i 