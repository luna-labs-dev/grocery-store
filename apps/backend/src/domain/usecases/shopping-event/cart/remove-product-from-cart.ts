export interface RemoveProductFromCartParams {
  userId: string;
  groupId: string;
  shoppingEventId: string;
  productId: string;
}

export interface RemoveProductFromCart {
  execute(params: RemoveProductFromCartParams): Promise<void>;
}
