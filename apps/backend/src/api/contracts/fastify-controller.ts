import type { FastifyPluginOptions } from 'fastify';
import { nameHelper } from '@/domain/helper';
import type { FastifyTypedInstance } from '@/main/fastify/types';

export abstract class FastifyController {
  readonly prefix: string;

  constructor() {
    this.prefix = nameHelper.toKebabCase(
      this.constructor.name.replace('Controller', ''),
    );
  }
  abstract registerRoutes(
    app: FastifyTypedInstance,
    opts: FastifyPluginOptions,
  ): void;
}
