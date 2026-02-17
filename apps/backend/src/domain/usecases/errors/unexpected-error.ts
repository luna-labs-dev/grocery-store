import type { UseCaseError } from '@/domain/core';

export class UnexpectedError extends Error implements UseCaseError {
  code: string;
  uuid?: string;

  constructor() {
    super('An unexpected error occurred in the application');
    this.name = 'UnexpectedError';
    this.code = 'UNEXPECTED_ERROR';
  }
}
