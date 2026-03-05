import type { ShoppingEvent } from '../../entities';

export interface StartShoppingEventParams {
  userId: string;
  groupId: string;
  marketId: string;
}

export interface StartShoppingEvent {
  execute(params: StartShoppingEventParams): Promise<ShoppingEvent>;
}
