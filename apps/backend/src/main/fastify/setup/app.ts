import { type FastifyTypeProvider, fastify } from 'fastify';
import qs from 'qs';
import { v4 as uuidv4 } from 'uuid';
import { setupDocsAndPrototipation } from './docs-and-prototipation';
import { setupErrorHandler } from './error-handler';
import { setupLogger } from './logger';
import { setupServer } from './server';

export const setupFastifyApp = () => {
  const app = fastify({
    logger: setupLogger(),
    genReqId: () => uuidv4(),
    querystringParser: (str) => qs.parse(str),
  }).withTypeProvider<FastifyTypeProvider>();

  setupServer(app);
  setupDocsAndPrototipation(app);

  app.setErrorHandler(setupErrorHandler);

  return { app };
};
