#!/bin/sh

(node_modules/.bin/prisma generate)
(node_modules/.bin/prisma migrate deploy)
(node dist/prisma/seed.js)
(node dist/src/main/server.js)
