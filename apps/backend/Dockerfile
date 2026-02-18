FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS dependencies
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/package.json
# Copy other workspace package.jsons if necessary, or just rely on pnpm install ignoring missing ones if strict-peer-dependencies is false, 
# but for a cleaner build we should probably copy what's needed. 
# For now, let's copy the backend package.json and install. 
# In a strict monorepo we might need to copy all libs/packages package.jsons too.
# Assuming backend only depends on external libs for now based on previous file exploration.
RUN pnpm install --frozen-lockfile

FROM base AS build
WORKDIR /app
COPY --from=dependencies /app/node_modules /app/node_modules
COPY --from=dependencies /app/apps/backend/node_modules /app/apps/backend/node_modules
COPY . .
# We need to run inside the package or use --filter
RUN pnpm --filter backend db:generate
RUN pnpm --filter backend build

FROM node:20-alpine AS runtime
WORKDIR /app
# We need to verify where the build output goes. usually apps/backend/dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/backend/scripts ./scripts
COPY --from=build /app/apps/backend/package.json ./apps/backend/package.json
COPY --from=build /app/apps/backend/dist ./apps/backend/dist
COPY --from=build /app/apps/backend/prisma ./apps/backend/prisma
COPY --from=build /app/apps/backend/node_modules ./apps/backend/node_modules

RUN apk --no-cache add curl openssl3
RUN chmod +x ./scripts/server.sh
EXPOSE 8004
ENTRYPOINT ["./scripts/server.sh"]
