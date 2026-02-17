import type { UseCaseError } from '@/domain/core';

export class InvalidFamilyNameError extends Error implements UseCaseError {
  code: string;
  uuid?: string | undefined;
  extras?: any;

  constructor(extras?: any) {
    super('Family name is invalid');
    this.name = 'InvalidFamilyNameError';
    this.code = 'INVALID_FAMILY_NAME_ERROR';
    this.extras = extras;
  }
}
