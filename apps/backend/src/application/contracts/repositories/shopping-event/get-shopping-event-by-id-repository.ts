import type { ShoppingEvent } from '@/domain';

export interface GetShoppingEventByIdRepositoryProps {
  familyId: string;
  shoppingEventId: string;
}

export interface GetShoppingEventByIdRepository {
  getById: (
    params: GetShoppingEventByIdRepositoryProps,
  ) => Promise<ShoppingEvent | undefined>;
}
