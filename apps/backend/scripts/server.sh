#!/bin/sh

(cd /home/node/app && node_modules/.bin/prisma generate)
(cd /home/node/app && node_modules/.bin/prisma migrate deploy)
(cd /home/node/app && node dist/prisma/seed.js)
(cd /home/node/app && node dist/src/main/server.js)
