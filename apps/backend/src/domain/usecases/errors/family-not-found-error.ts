import type { UseCaseError } from '@/domain';

export class FamilyNotFoundError extends Error implements UseCaseError {
  code: string;
  uuid?: string;

  constructor(uuid?: string) {
    super('The Family was not found');
    this.name = 'FamilyNotFoundError';
    this.code = 'FAMILY_NOT_FOUND_ERROR';
    this.uuid = uuid;
  }
}
