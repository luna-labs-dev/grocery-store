export interface RemoveProductFromCartParams {
  groupId: string;
  shoppingEventId: string;
  productId: string;
}

export interface RemoveProductFromCart {
  execute(params: RemoveProductFromCartParams): Promise<void>;
}
