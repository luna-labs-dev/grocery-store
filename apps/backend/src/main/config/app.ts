import { clerkMiddleware } from '@clerk/express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import logger from 'morgan';
import { env } from '@/main/config';
import { router } from '@/main/express/routes';

export const setupApp = async (): Promise<Express> => {
  const app = express();

  const { logLevel, origins } = env.baseConfig;

  app.use(express.json({ limit: '50mb' }));

  app.use(
    cors({
      origin: origins,
      credentials: true,
    }),
  );

  app.use(cookieParser());

  app.use(clerkMiddleware());

  switch (logLevel) {
    case 'debug':
      app.use(logger('combined'));
      break;
    case 'dev':
      app.use(logger('dev'));
      break;
    case 'prod':
      app.use(
        logger('combined', {
          skip: (_, res) => res.statusCode < 400,
        }),
      );
      break;
    default:
      break;
  }

  app.use(
    logger('dev', {
      skip: (_, res) => res.statusCode < 400,
    }),
  );
  app.use(router);

  return app;
};
