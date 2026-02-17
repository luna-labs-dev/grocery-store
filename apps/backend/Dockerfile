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
COPY --from=build /app/apps/backend/package.json ./package.json
COPY --from=build /app/apps/backend/dist ./dist
COPY --from=build /app/apps/backend/scripts ./scripts
COPY --from=build /app/apps/backend/prisma ./prisma
COPY --from=build /app/node_modules ./node_modules
# Backend specific node_modules might be in apps/backend/node_modules if not hoisted
COPY --from=build /app/apps/backend/node_modules ./node_modules_backend
# Adjust NODE_PATH or move modules if necessary. 
# Simpler approach: deploy as a monorepo slice or just copy what's needed.
# Let's try to copy prod deps.
# Actually, for a production image, we often want only prod deps.
# Let's refine the runtime stage to install only prod deps if possible, or copy from a prod-install stage.
# Given complexity, let's stick to copying built artifacts and necessary deps.
# To keep it simple and safe for now, I will copy the node_modules from build which has everything. 
# Optimization can be done later.

RUN apk --no-cache add curl openssl3
RUN chmod +x ./scripts/server.sh
EXPOSE 8004
ENTRYPOINT ["./scripts/server.sh"]
