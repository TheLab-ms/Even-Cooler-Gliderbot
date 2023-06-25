FROM node:lts-alpine

WORKDIR /usr
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm ci
RUN npm run build

RUN npm i -g pm2

CMD ["pm2-runtime", "start", "dist/index.js"]
