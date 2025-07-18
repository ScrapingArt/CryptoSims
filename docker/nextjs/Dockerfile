FROM node:20

RUN addgroup --gid 1001 cryptosims
RUN adduser --disabled-password --uid 1001 --ingroup cryptosims cryptosims

USER cryptosims

WORKDIR /usr/src/app

COPY ./src ./src
COPY --chown=cryptosims:cryptosims ./public ./public
COPY ./.env ./
COPY ./eslint.config.mjs ./
COPY ./next-env.d.ts ./
COPY ./next.config.ts ./
COPY ./package.json .
COPY ./postcss.config.mjs ./
COPY ./tailwind.config.ts ./
COPY ./tsconfig.json ./

RUN npm install

EXPOSE 3000

CMD sh -c "export MONGO_PASSWORD=\$(cat /run/secrets/mongo_password) && curl -L -o bitcoin-historical-data.zip https://www.kaggle.com/api/v1/datasets/download/mczielinski/bitcoin-historical-data && unzip -o bitcoin-historical-data.zip && mv btcusd_1-min_data.csv data.csv && rm bitcoin-historical-data.zip && npm run dev"