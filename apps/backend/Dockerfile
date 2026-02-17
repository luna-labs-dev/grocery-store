FROM node:lts-alpine AS dev-dependencies
WORKDIR /app
COPY package.json yarn.* tsconfig.json ./
COPY ./src ./src
COPY ./.husky ./.husky
RUN yarn install --production=false --frozen-lockfile

FROM node:lts-alpine AS dependencies
WORKDIR /app
COPY package.json yarn.* ./
COPY ./src ./src
RUN yarn install --production=true --frozen-lockfile

FROM node:lts-alpine AS build
WORKDIR /app
COPY --from=dev-dependencies /app/ .
COPY . .
RUN yarn db:generate
RUN yarn build

FROM node:lts-alpine AS runtime
COPY --chown=node:node --from=dependencies /app/node_modules /home/node/app/node_modules/
COPY --from=build --chown=node:node /app/package.json /home/node/app/package.json
COPY --from=build --chown=node:node /app/dist /home/node/app/dist/
COPY --from=build --chown=node:node /app/scripts /home/node/app/scripts/
COPY --from=build --chown=node:node /app/prisma /home/node/app/prisma/
RUN apk --no-cache add curl openssl3
RUN chmod ug+x /home/node/app/scripts/server.sh
EXPOSE 8004
ENTRYPOINT ["/home/node/app/scripts/server.sh"]
