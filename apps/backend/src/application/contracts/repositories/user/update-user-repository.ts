import type { User } from '@/domain';

export interface UpdateUserRepository {
  update: (user: User) => Promise<void>;
}
