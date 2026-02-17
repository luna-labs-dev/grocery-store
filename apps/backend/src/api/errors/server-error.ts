import { HttpError } from './http-error';

export class ServerError extends HttpError {
  constructor(stack: string) {
    super({
      message: 'Internal server error',
      name: 'ServerError',
      code: 'SERVER_ERROR',
      stack,
    });
  }
}
