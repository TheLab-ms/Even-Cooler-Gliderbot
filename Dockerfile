FROM oven/bun

# We need curl for a hack
RUN apt update
RUN apt install -y curl

WORKDIR /usr

COPY package.json ./
COPY bun.lockb ./
COPY tsconfig.json ./
COPY src ./src

RUN bun install

CMD ["bun", "run", "start"]
