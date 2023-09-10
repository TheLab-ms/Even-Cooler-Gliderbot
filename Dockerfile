FROM oven/bun

WORKDIR /usr
COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./
COPY src ./src

RUN bun install

CMD ["bun", "run", "start"]
