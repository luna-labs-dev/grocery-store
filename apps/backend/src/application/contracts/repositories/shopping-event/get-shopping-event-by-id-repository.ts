import type { ShoppingEvent } from '@/domain';

export interface GetShoppingEventByIdRepositoryProps {
  groupId: string;
  shoppingEventId: string;
}

export interface GetShoppingEventByIdRepository {
  getById: (
    params: GetShoppingEventByIdRepositoryProps,
  ) => Promise<ShoppingEvent | undefined>;
}
