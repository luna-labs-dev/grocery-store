#!/bin/sh

(cd /home/node/app/apps/backend && node_modules/.bin/prisma generate)
(cd /home/node/app/apps/backend && node_modules/.bin/prisma migrate deploy)
(cd /home/node/app/apps/backend && node dist/prisma/seed.js)
(cd /home/node/app/apps/backend && node dist/src/main/server.js)
