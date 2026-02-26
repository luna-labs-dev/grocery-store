import type { ShoppingEvent } from '../../entities';

export interface StartShoppingEventParams {
  user: string;
  familyId: string;
  marketId: string;
}

export interface StartShoppingEvent {
  execute(params: StartShoppingEventParams): Promise<ShoppingEvent>;
}
