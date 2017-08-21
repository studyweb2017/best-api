# vue-cli
FROM node:7-alpine
RUN mkdir /app
RUN chmod 777 /app
WORKDIR /app
EXPOSE 8080
VOLUME ["/app/src", "/app/static", "/app/test"]

COPY ./package.json /app
RUN cd /app && npm i 
COPY . /app

# docker run -itd --name api-web -p 2015:2015 -v c:\Repo\api-document-mock-server\web\:/app -v node_modules:/app/node_modules -w /app -e SERVER_HOST=api-server -e SERVER_PORT=2016 --network api-net -h web node:7-alpine