import type { UseCaseError } from '@/domain/core';

export class FamilyOwnerCannotBeRemovedError
  extends Error
  implements UseCaseError
{
  code: string;
  uuid?: string | undefined;
  extras?: any;

  constructor(uuid?: string, extras?: any) {
    super('Family owner cannot be removed');
    this.name = 'FamilyOwnerCannotBeRemovedError';
    this.code = 'FAMILY_OWNER_CANNOT_BE_REMOVED_ERROR';
    this.uuid = uuid;
    this.extras = extras;
  }
}
