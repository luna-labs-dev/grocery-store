import type {
  UnexpectedError,
  UserNotAFamilyMemberError,
  UserNotFoundError,
} from '../errors';
import type { Either } from '@/domain/core';

export interface LeaveFamilyParams {
  userId: string;
}

export type LeaveFamilyErrors =
  | UnexpectedError
  | UserNotFoundError
  | UserNotAFamilyMemberError;

export interface LeaveFamily {
  execute(request: LeaveFamilyParams): Promise<Either<LeaveFamilyErrors, void>>;
}
