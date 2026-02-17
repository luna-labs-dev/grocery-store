import type { UseCaseError } from '@/domain/core';

export class UserAlreadyExistsError extends Error implements UseCaseError {
  code: string;
  uuid?: string | undefined;
  extras?: any;

  constructor() {
    super('User with this externalId already exists');
    this.name = 'UserAlreadyExistsError';
    this.code = 'USER_ALREADY_EXISTS_ERROR';
  }
}
