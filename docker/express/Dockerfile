FROM node:20

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./server.js ./
COPY ./update.sh ./

RUN npm install

EXPOSE 3001

CMD sh -c "./update.sh && node server.js"