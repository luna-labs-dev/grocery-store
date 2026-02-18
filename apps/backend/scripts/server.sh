#!/bin/sh
(echo 'root')
(ls)
(cd /app/apps/backend && node_modules/.bin/prisma generate)
(cd /app/apps/backend && node_modules/.bin/prisma migrate deploy)
(cd /app/apps/backend && node dist/prisma/seed.js)
(cd /app/apps/backend && node dist/src/main/server.js)
