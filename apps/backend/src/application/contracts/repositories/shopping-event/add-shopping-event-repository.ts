import type { ShoppingEvent } from '@/domain';

export interface AddShoppingEventRepository {
  add: (shoppingEvent: ShoppingEvent) => Promise<void>;
}
