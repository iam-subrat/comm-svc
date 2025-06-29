FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY ./src .

CMD ["node", "index.js"]