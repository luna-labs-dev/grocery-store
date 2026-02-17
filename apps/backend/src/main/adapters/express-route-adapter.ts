import { getAuth } from '@clerk/express';
import type { Request, Response } from 'express';
import type { Controller } from '@/api/contracts';

export const adaptRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const { userId } = getAuth(request);

    const requestData = {
      ...request.body,
      ...request.params,
      ...request.query,
      auth: request.auth(),
      user: userId,
    };

    const httpResponse = await controller.handle(requestData);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      return response.status(httpResponse.statusCode).json(httpResponse.body);
    }
    return response
      .status(httpResponse.statusCode)
      .json(httpResponse.body.toResult());
  };
};
