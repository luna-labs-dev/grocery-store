export interface ProductIdentity {
  id: string;
  canonicalProductId: string;
  type: string;
  value: string;
  name?: string;
  brand?: string;
  imageUrl?: string;
  createdAt: Date;
}

export interface ProductIdentityRepository {
  getById(id: string): Promise<ProductIdentity | null>;
  search(
    query: string,
    pageIndex: number,
    pageSize: number,
  ): Promise<{ items: ProductIdentity[]; total: number }>;
}
