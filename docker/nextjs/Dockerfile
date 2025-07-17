FROM node:20

WORKDIR /usr/src/app

COPY ./.env ./
COPY ./eslint.config.mjs ./
COPY ./next-env.d.ts ./
COPY ./next.config.ts ./
COPY ./package.json .
COPY ./postcss.config.mjs ./
COPY ./public ./public
COPY ./src ./src
COPY ./tailwind.config.ts ./
COPY ./tsconfig.json ./

RUN npm install
RUN npm run build

EXPOSE 3000

CMD sh -c "export MONGO_PASSWORD=\$(cat /run/secrets/mongo_password) && curl -L -o bitcoin-historical-data.zip https://www.kaggle.com/api/v1/datasets/download/mczielinski/bitcoin-historical-data && unzip -o bitcoin-historical-data.zip && mv btcusd_1-min_data.csv data.csv && rm bitcoin-historical-data.zip && npm run start"