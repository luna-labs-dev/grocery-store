import type { FastifyPluginOptions } from 'fastify';
import type { FastifyTypedInstance } from '@/main/fastify/types';

export abstract class FastifyController {
  readonly prefix: string;

  constructor() {
    console.log(this.constructor.name);
    this.prefix = this.constructor.name.replace('Controller', '').toLowerCase();
  }
  abstract registerRoutes(
    app: FastifyTypedInstance,
    opts: FastifyPluginOptions,
  ): void;
}
