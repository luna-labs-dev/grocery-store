import type { FastifyServerOptions } from 'fastify';
import { env } from '@/main/config/env';

const envToLogger = {
  development: {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'dd-mm-yyyy HH:MM:ss',
      },
    },
  },
  production: true,
  local: false,
};

const { baseConfig } = env;

export const setupLogger = (): FastifyServerOptions['logger'] => {
  return envToLogger[baseConfig.environment];
};
