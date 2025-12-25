FROM node:24-alpine

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

RUN yarn prisma generate
RUN yarn build

EXPOSE 3333

CMD ["node", "dist/server.js"]
