import { HttpError } from './http-error';

export class UnprocessableEntityError extends HttpError {
  constructor(code: string, message: string, uuid?: string) {
    super({ message, name: 'UnprocessableEntityError', code, uuid });
  }
}
