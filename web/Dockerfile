# vue-cli
FROM node:7-alpine
RUN mkdir /app
RUN chmod 777 /app
WORKDIR /app
EXPOSE 8080 2017
VOLUME ["/app"]

COPY ./Hongkong /etc/localtime
RUN npm set registry https://registry.npm.taobao.org
RUN npm i -g typescript