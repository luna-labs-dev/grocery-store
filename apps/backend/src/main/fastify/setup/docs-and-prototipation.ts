import { fastifySwagger } from '@fastify/swagger';
import { fastifySwaggerUi } from '@fastify/swagger-ui';
import ScalarApiReference from '@scalar/fastify-api-reference';
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod';
import type { FastifyTypedInstance } from '../types';

export const setupDocsAndPrototipation = (app: FastifyTypedInstance) => {
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Grocery Store API',
        description: 'API de gerenciamento de compras',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  app.register(fastifySwaggerUi, {
    routePrefix: '/swagger',
  });

  app.register(ScalarApiReference, {
    routePrefix: '/scalar',
  });
};
