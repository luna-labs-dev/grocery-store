import { container } from 'tsyringe';
import { injection } from '../di';
import type { FastifyTypedInstance } from './types';
import type { FastifyController } from '@/api/contracts/fastify-controller';

const { controllers: controllerTokens } = injection;

export const registerControllers = async (app: FastifyTypedInstance) => {
  const fastifyControllers = container.resolveAll<FastifyController>(
    controllerTokens.fastify,
  );

  for (const ctrlr of fastifyControllers) {
    app.log.info(`Registering ${ctrlr.prefix} routes`);
    app.register(ctrlr.registerRoutes.bind(ctrlr), {
      prefix: ctrlr.prefix,
    });
  }
};
