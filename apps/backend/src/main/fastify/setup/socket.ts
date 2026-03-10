import type { FastifyInstance } from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import { env } from '@/main/config/env';
import { onConnection } from '@/main/fastify/socket/shopping-sync';
import { socketAuthMiddleware } from '@/main/fastify/socket/socket-auth';

export const setupSocket = async (app: FastifyInstance) => {
  await app.register(fastifySocketIO, {
    cors: {
      origin: env.baseConfig.origins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Wait for the app to be ready so that the 'io' property is available
  app.ready((err) => {
    if (err) throw err;

    // Use socketAuthMiddleware as a socket.io middleware
    // @ts-expect-error
    app.io.use(async (socket, next) => {
      const isAuthenticated = await socketAuthMiddleware(socket);
      if (isAuthenticated) {
        next();
      } else {
        next(new Error('Authentication failed'));
      }
    });

    // @ts-expect-error
    app.io.on('connection', (socket: any) => onConnection(socket, app));
  });
};
