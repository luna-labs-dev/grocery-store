import { Router } from 'express';
import { container } from 'tsyringe';
import { adaptRoute } from '../../adapters';
import { injection } from '../../di';

export const shoppingEventRouter = Router();

shoppingEventRouter.post(
  '/start',
  adaptRoute(container.resolve(injection.controllers.startShoppingEvent)),
);

shoppingEventRouter.put(
  '/end/:shoppingEventId',
  adaptRoute(container.resolve(injection.controllers.endShoppingEvent)),
);

shoppingEventRouter.get(
  '/',
  adaptRoute(container.resolve(injection.controllers.getShoppingEventList)),
);

shoppingEventRouter.get(
  '/:shoppingEventId',
  adaptRoute(container.resolve(injection.controllers.getShoppingEventById)),
);

shoppingEventRouter.post(
  '/:shoppingEventId/cart',
  adaptRoute(container.resolve(injection.controllers.addProductToCart)),
);

shoppingEventRouter.put(
  '/:shoppingEventId/cart/:productId',
  adaptRoute(container.resolve(injection.controllers.updateProductInCart)),
);

shoppingEventRouter.delete(
  '/:shoppingEventId/cart/:productId',
  adaptRoute(container.resolve(injection.controllers.removeProductFromCart)),
);
