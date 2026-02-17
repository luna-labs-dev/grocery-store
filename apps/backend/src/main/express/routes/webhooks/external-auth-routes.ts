import { Router } from 'express';
import { container } from 'tsyringe';
import { adaptRoute } from '@/main/adapters';
import { injection } from '@/main/di';

const { controllers } = injection;

export const webhookExternalAuthRouter = Router();

webhookExternalAuthRouter.post(
  '/add-user',
  adaptRoute(
    container.resolve(controllers.webhooks.externalAuthService.addUser),
  ),
);
