FROM node:20.2.0-alpine3.17 AS build

WORKDIR /app
COPY source ./source
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci --silence
RUN npm run bundle:compile

FROM node:20.2.0-alpine3.17

WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules

CMD node build/index.js
