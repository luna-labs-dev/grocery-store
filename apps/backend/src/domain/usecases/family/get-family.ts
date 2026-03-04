import type { Family } from '@/domain/entities';

export interface GetFamilyParams {
  userId: string;
}

export interface GetFamily {
  execute(params: GetFamilyParams): Promise<Family>;
}
