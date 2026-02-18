import type {
  InvalidInviteCodeError,
  UnexpectedError,
  UserAlreadyAFamilyMemberError,
  UserNotFoundError,
} from '../errors';
import type { Either } from '@/domain/core';

export interface JoinFamilyParams {
  userId: string;
  inviteCode: string;
}

export type JoinFamilyErrors =
  | UnexpectedError
  | UserNotFoundError
  | UserAlreadyAFamilyMemberError
  | InvalidInviteCodeError;

export interface JoinFamily {
  execute(params: JoinFamilyParams): Promise<Either<JoinFamilyErrors, void>>;
}
