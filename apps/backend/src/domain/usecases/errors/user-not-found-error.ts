import type { UseCaseError } from '@/domain/core';

export class UserNotFoundError extends Error implements UseCaseError {
  code: string;
  uuid?: string;
  extras?: any;

  constructor(uuid?: string, extras?: any) {
    super('User not found');
    this.name = 'UserNotFoundError';
    this.code = 'USER_NOT_FOUND_ERROR';
    this.uuid = uuid;
    this.extras = extras;
  }
}
