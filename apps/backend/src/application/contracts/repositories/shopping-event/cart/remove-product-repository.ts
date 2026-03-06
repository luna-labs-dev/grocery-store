export interface RemoveProductRepositoryParams {
  shoppingEventId: string;
  productId: string;
}

export interface RemoveProductRepository {
  remove(
    params: RemoveProductRepositoryParams,
    transaction?: unknown,
  ): Promise<void>;
}
