import { HttpError } from './http-error';
import type { UseCaseError } from '@/domain';

export class ConflictError extends HttpError {
  constructor(error?: UseCaseError) {
    super({
      message: error?.message ?? 'Conflict',
      name: error?.name ?? 'ConflictError',
      code: error?.code ?? 'CONFLICT_ERROR',
      uuid: error?.uuid,
      extras: error?.extras,
    });
  }
}
