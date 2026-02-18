import type { UseCaseError } from '@/domain/core';

export class FamilyWithoutMembersError extends Error implements UseCaseError {
  code: string;
  uuid?: string | undefined;
  extras?: any;
  constructor(uuid?: string, extras?: any) {
    super('Family without members');
    this.name = 'FamilyWithoutMembersError';
    this.code = 'FAMILY_WITHOUT_MEMBERS_ERROR';
    this.uuid = uuid;
    this.extras = extras;
  }
}
