import type { UseCaseError } from '@/domain/core';

export class InvalidInviteCodeError extends Error implements UseCaseError {
  code: string;
  uuid?: string | undefined;
  extras?: any;

  constructor(uuid?: string) {
    super('Invalid invite code');
    this.name = 'InvalidInviteCodeError';
    this.code = 'INVALID_INVITE_CODE_ERROR';
    this.uuid = uuid;
  }
}
