import type { FastifyInstance } from 'fastify';
import fastifySocketIO from 'fastify-socket.io';
import type { Server, Socket } from 'socket.io';
import { env } from '@/main/config/env';
import { onConnection } from '@/main/fastify/socket/shopping-sync';
import { socketAuthMiddleware } from '@/main/fastify/socket/socket-auth';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '@/main/fastify/socket/socket-types';

export const setupSocket = async (app: FastifyInstance) => {
  await app.register(fastifySocketIO, {
    cors: {
      origin: env.baseConfig.origins,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  // Wait for the app to be ready so that the 'io' property is available
  app.ready((err: Error | null) => {
    if (err) throw err;

    // Use socketAuthMiddleware as a socket.io middleware
    (
      app as unknown as {
        io: Server<ClientToServerEvents, ServerToClientEvents>;
      }
    ).io.use(
      async (
        socket: Socket<ClientToServerEvents, ServerToClientEvents>,
        next,
      ) => {
        const isAuthenticated = await socketAuthMiddleware(socket);
        if (isAuthenticated) {
          next();
        } else {
          next(new Error('Authentication failed'));
        }
      },
    );

    (
      app as unknown as {
        io: Server<ClientToServerEvents, ServerToClientEvents>;
      }
    ).io.on(
      'connection',
      (socket: Socket<ClientToServerEvents, ServerToClientEvents>) =>
        onConnection(socket, app),
    );
  });
};
