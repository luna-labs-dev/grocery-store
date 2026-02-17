import { Router } from 'express';
import { authorizationMiddleware } from '../middlewares/authorization-middleware';
import { familyRouter } from './family-routes';
import { marketRouter } from './market-routes';
import { shoppingEventRouter } from './shopping-event-routes';
import { webhookRouter } from './webhooks';
import { otherRouter } from '@/main/express/routes/other-routes';

const router = Router();
router.use('/', otherRouter);
router.use(
  '/api/grocery-shopping/v1/market',
  authorizationMiddleware,
  marketRouter,
);
router.use(
  '/api/grocery-shopping/v1/shopping-event',
  authorizationMiddleware,
  shoppingEventRouter,
);
router.use(
  '/api/grocery-shopping/v1/family',
  authorizationMiddleware,
  familyRouter,
);
router.use('/api/grocery-shopping/v1/webhook', webhookRouter);

export { router };
