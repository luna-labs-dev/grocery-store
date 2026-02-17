import type { UnexpectedError, UserNotFoundError } from '../errors';
import type { Either } from '@/domain/core';
import type { Family } from '@/domain/entities';

export interface AddFamilyParams {
  userId: string;
  name: string;
  description?: string;
}

export type AddFamilyErrors = UnexpectedError | UserNotFoundError;

export interface AddFamily {
  execute(request: AddFamilyParams): Promise<Either<AddFamilyErrors, Family>>;
}
