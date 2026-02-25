#!/bin/sh

(cd /app/apps/backend && node dist/src/infrastructure/repositories/drizzle/setup/migrate.js)
(cd /app/apps/backend && node dist/src/main/server.js)
