import type { ShoppingEvent } from '../../entities';

export interface EndShoppingEventParams {
  shoppingEventId: string;
  familyId: string;
  totalPaid: number;
}

export interface EndShoppingEvent {
  execute(params: EndShoppingEventParams): Promise<ShoppingEvent>;
}
