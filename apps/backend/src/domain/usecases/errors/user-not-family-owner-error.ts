import type { UseCaseError } from '@/domain/core';

export class UserNotFamilyOwnerError extends Error implements UseCaseError {
  code: string;
  uuid?: string | undefined;
  extras?: any;

  constructor(uuid?: string, extras?: any) {
    super('User is not the owner of the family');
    this.name = 'UserNotFamilyOwnerError';
    this.code = 'USER_NOT_FAMILY_OWNER_ERROR';
    this.uuid = uuid;
    this.extras = extras;
  }
}
