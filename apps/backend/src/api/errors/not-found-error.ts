import { HttpError } from './http-error';
import type { UseCaseError } from '@/domain';

export class NotFoundError extends HttpError {
  constructor(error: UseCaseError) {
    super({
      message: error.message,
      code: error.code,
      name: error.name,
      uuid: error.uuid,
      extras: error.extras,
    });
  }
}
