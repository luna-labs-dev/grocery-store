import { HttpError } from './http-error';

export class BadRequestError extends HttpError {
  constructor(code: string, message: string, uuid?: string) {
    super({ message, name: 'BadRequestError', code, uuid });
  }
}
