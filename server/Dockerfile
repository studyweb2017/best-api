# api-server
FROM node:7-alpine
RUN mkdir /app
RUN chmod 777 /app
WORKDIR /app
VOLUME ["/app/src"]

RUN apk update && apk add tzdata \
      && cp -r -f /usr/share/zoneinfo/Hongkong /etc/localtime
RUN npm set registry=https://registry.npm.taobao.org
RUN npm i -g pm2  nodemon
COPY package.json /app
RUN cd /app
RUN npm i

# docker run -itd --name api-server -p 2016:2016 -v c:\Repo\api-document-mock-server\server\:/app -v node_modules:/app/node_modules -w /app -e API_DB_HOST=api-db -e API_DB_PORT=27017 --network api-net -h server node:7-alpine
# docker run -itd --name api-db --network api-net -h db mongo