import { type Request, type Response, Router } from 'express';

export const otherRouter = Router();

otherRouter.get('/', (_req, res) => {
  res.send({
    serviceName: 'grocery-store',
    version: '1.0.0',
  });
});

otherRouter.get('/healthCheck', (_req: Request, res: Response): void => {
  res.status(200).json({ message: 'healthy' });
});
