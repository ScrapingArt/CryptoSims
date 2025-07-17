FROM node:20

RUN addgroup --gid 1001 express
RUN adduser --disabled-password --uid 1001 --ingroup express express

USER express

WORKDIR /usr/src/app

COPY ./package*.json ./
COPY ./server.js ./
COPY ./update.sh ./

RUN npm install

EXPOSE 3001

CMD sh -c "./update.sh && node server.js"