import type {
  UnexpectedError,
  UserNotAFamilyMemberError,
  UserNotFoundError,
} from '../errors';
import type { Either } from '@/domain/core';
import type { Family } from '@/domain/entities';

export interface GetFamilyParams {
  userId: string;
}

export type GetFamilyErrors =
  | UnexpectedError
  | UserNotFoundError
  | UserNotAFamilyMemberError;
export interface GetFamily {
  execute(params: GetFamilyParams): Promise<Either<GetFamilyErrors, Family>>;
}
