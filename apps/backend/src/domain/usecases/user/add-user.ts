import type { UnexpectedError, UserAlreadyExistsError } from '../errors';
import type { Either } from '@/domain/core';

export interface AddUserParams {
  externalId: string;
}

export type AddUserErrors = UnexpectedError | UserAlreadyExistsError;
export interface AddUser {
  execute(params: AddUserParams): Promise<Either<AddUserErrors, void>>;
}
