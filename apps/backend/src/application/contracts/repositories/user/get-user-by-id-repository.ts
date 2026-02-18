import type { User } from '@/domain';

export interface GetUserByIdRepository {
  getById: (userId: string) => Promise<User | undefined>;
  getByExternalId: (externalId: string) => Promise<User | undefined>;
}
