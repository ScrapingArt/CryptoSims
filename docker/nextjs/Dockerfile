FROM node:20

WORKDIR /usr/src/app

COPY ./package.json .

EXPOSE 3000

CMD sh -c "npm install && curl -L -o bitcoin-historical-data.zip https://www.kaggle.com/api/v1/datasets/download/mczielinski/bitcoin-historical-data && unzip -o bitcoin-historical-data.zip && mv btcusd_1-min_data.csv data.csv && rm bitcoin-historical-data.zip && npm run dev"