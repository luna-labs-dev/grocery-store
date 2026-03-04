import type { Family } from '@/domain/entities';

export interface AddFamilyParams {
  userId: string;
  name: string;
  description?: string;
}

export interface AddFamily {
  execute(request: AddFamilyParams): Promise<Family>;
}
