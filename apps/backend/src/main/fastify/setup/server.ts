import { fastifyCors } from '@fastify/cors';
import type { FastifyTypedInstance } from '../types';
import { env } from '@/main/config/env';

const { baseConfig } = env;

export const setupServer = (app: FastifyTypedInstance) => {
  app.register(fastifyCors, {
    origin: baseConfig.origins,
    credentials: true,
  });
};
