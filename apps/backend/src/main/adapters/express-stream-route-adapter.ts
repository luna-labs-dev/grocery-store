import type { Request, Response } from 'express';
import type { Controller } from '@/api/contracts';

export const adaptStreamRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const requestData = {
      ...request.body,
      ...request.params,
      ...request.query,
      user: request.headers['x-user'],
    };

    const httpResponse = await controller.handle(requestData);

    if (httpResponse.statusCode >= 200 && httpResponse.statusCode <= 299) {
      response.setHeader('Content-Type', httpResponse.body.type);
      return httpResponse.body.file.pipe(response);
    }
    return response
      .status(httpResponse.statusCode)
      .json(httpResponse.body.toResult());
  };
};
