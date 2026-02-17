FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/package.json
# Copy other workspace package.jsons if necessary.
RUN pnpm install --frozen-lockfile

COPY . .
ARG VITE_CLERK_PUBLISHABLE_KEY
ARG VITE_BACKEND_URL
# Run build for frontend
RUN pnpm --filter frontend build

# Etapa 2: imagem final com Nginx
FROM nginx:alpine

RUN apk add --no-cache bash curl gettext

# Copia nginx/template e script de substituição
# These files are inside apps/frontend/proxy
COPY apps/frontend/proxy/nginx.template.conf /nginx.template.conf
COPY apps/frontend/proxy/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Copia os arquivos estáticos da UI
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

ENTRYPOINT ["/entrypoint.sh"]