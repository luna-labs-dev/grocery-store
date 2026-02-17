import { HttpError } from './http-error';

export class UnauthorizedError extends HttpError {
  constructor(extras?: any) {
    super({
      message: 'Unauthorized',
      name: 'UnauthorizedError',
      code: 'UNAUTHORIZED_ERROR',
      extras,
    });
  }
}
