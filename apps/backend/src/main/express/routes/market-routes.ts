import { Router } from 'express';
import { container } from 'tsyringe';
import { adaptRoute } from '../../adapters';
import { injection } from '../../di';

export const marketRouter = Router();

marketRouter.get(
  '/',
  adaptRoute(container.resolve(injection.controllers.getMarketList)),
);
marketRouter.get(
  '/:marketId',
  adaptRoute(container.resolve(injection.controllers.getMarketById)),
);
