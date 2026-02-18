import type { Either } from '../../core';
import type { User } from '../../entities';
import type { UnexpectedError } from '../errors';

export interface GetUserParams {
  externalId: string;
}

export type GetUserErrors = UnexpectedError;

export interface GetUser {
  execute(params: GetUserParams): Promise<Either<GetUserErrors, User>>;
}
