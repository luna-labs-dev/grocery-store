#!/bin/sh

(cd /app/apps/backend && node dist/infrastructure/repositories/drizzle/setup/migrate.js)
(cd /app/apps/backend && node dist/main/server.js)
