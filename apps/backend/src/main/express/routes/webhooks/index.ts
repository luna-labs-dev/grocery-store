import { Router } from 'express';
import { webhookExternalAuthRouter } from './external-auth-routes';

export const webhookRouter = Router();

webhookRouter.use('/external-auth', webhookExternalAuthRouter);
