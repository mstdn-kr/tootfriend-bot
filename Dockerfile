FROM node:10

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn config set network-timeout 1000000 -g && \
    yarn install

COPY . .

CMD ["node", "/app/bot.js"]