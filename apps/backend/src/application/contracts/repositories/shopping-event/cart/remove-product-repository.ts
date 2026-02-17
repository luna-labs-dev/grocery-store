export interface RemoveProductRepositoryParams {
  shoppingEventId: string;
  productId: string;
}

export interface RemoveProductRepository {
  remove: (params: RemoveProductRepositoryParams) => Promise<void>;
}
