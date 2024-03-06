FROM node:lts-alpine

WORKDIR /usr
COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src

RUN npm ci
RUN npm run build

CMD ["node", "dist/index.js"]
