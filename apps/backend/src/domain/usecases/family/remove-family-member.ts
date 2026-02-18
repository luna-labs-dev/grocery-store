import type {
  FamilyOwnerCannotBeRemovedError,
  UnexpectedError,
  UserNotAFamilyMemberError,
  UserNotFamilyOwnerError,
  UserNotFoundError,
} from '../errors';
import type { Either } from '@/domain/core';

export interface RemoveFamilyMemberParams {
  userToBeRemovedId: string;
  userId: string;
}

export type RemoveFamilyMemberErrors =
  | UnexpectedError
  | UserNotFoundError
  | UserNotAFamilyMemberError
  | UserNotFamilyOwnerError
  | FamilyOwnerCannotBeRemovedError;

export interface RemoveFamilyMember {
  execute(
    params: RemoveFamilyMemberParams,
  ): Promise<Either<RemoveFamilyMemberErrors, void>>;
}
