# api-server
FROM node:7-alpine
RUN mkdir /app
RUN chmod 777 /app
WORKDIR /app
VOLUME ["/app"]
EXPOSE 2018

COPY ./Hongkong /etc/localtime
RUN npm set registry https://registry.npm.taobao.org
RUN npm i -g pm2 nodemon typescript