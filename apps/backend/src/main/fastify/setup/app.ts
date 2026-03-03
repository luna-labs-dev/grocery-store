import { clerkPlugin } from '@clerk/fastify';
import { type FastifyTypeProvider, fastify } from 'fastify';
import qs from 'qs';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config/env';
import { setupDocsAndPrototipation } from './docs-and-prototipation';
import { setupErrorHandler } from './error-handler';
import { setupLogger } from './logger';
import { setupServer } from './server';

const { clerk } = env;

export const setupFastifyApp = () => {
  const app = fastify({
    logger: setupLogger(),
    genReqId: () => uuidv4(),
    querystringParser: (str) => qs.parse(str),
  }).withTypeProvider<FastifyTypeProvider>();

  setupServer(app);
  setupDocsAndPrototipation(app);

  app.setErrorHandler(setupErrorHandler);

  // Clerk
  app.register(clerkPlugin, {
    publishableKey: clerk.publishableKey,
    secretKey: clerk.secretKey,
  });

  return { app };
};
