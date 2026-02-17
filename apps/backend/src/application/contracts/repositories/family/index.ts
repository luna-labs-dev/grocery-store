import type { AddFamilyRepository } from './add-family-repository';
import type { GetFamilyByIdRepository } from './get-family-by-id';
import type { GetFamilyByInviteCodeRepository } from './get-family-by-invite-code-repository';
import type { UpdateFamilyRepository } from './update-family-repository';

export const mappedPrismaErrors: Record<string, string> = {
  P2002: 'UniqueConstraintViolation',

  UNMAPPED: 'UNMAPPED',
};

export const getMappedPrismaError = (errorCode: string): string => {
  return mappedPrismaErrors[errorCode] ?? mappedPrismaErrors.UNMAPPED;
};

export type FamilyRepositories = AddFamilyRepository &
  GetFamilyByIdRepository &
  GetFamilyByInviteCodeRepository &
  UpdateFamilyRepository;

export * from './add-family-repository';
export * from './get-family-by-id';
export * from './get-family-by-invite-code-repository';
export * from './update-family-repository';
