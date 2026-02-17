import { getAuth } from '@clerk/express';
import type { NextFunction, Request, Response } from 'express';
import { unauthorized } from '@/api';

export const authorizationMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      throw new Error('User not found');
    }

    next();
  } catch (error) {
    const unauthorizedError = unauthorized({
      error,
    });

    return res
      .status(unauthorizedError.statusCode)
      .json(unauthorizedError.body.toResult());
  }
};
