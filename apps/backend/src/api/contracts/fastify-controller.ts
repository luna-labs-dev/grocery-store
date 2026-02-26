import type { FastifyTypedInstance } from '@/main/fastify/types';

export abstract class FastifyController {
  abstract registerRoutes(app: FastifyTypedInstance): void;
}
