import type { UseCaseError } from '@/domain/core';

export class UserAlreadyAFamilyMemberError
  extends Error
  implements UseCaseError
{
  code: string;
  uuid?: string | undefined;
  extras?: any;

  constructor() {
    super('User is already a family member');
    this.name = 'UserAlreadyAFamilyMemberError';
    this.code = 'USER_ALREADY_A_FAMILY_MEMBER_ERROR';
  }
}
