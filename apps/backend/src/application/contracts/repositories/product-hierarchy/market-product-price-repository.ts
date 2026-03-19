export interface MarketProductPrice {
  marketId: string;
  productIdentityId: string;
  price: number;
  lastVerifiedAt: Date;
  isVerified: boolean;
}

export interface GetMarketProductPriceRepository {
  getByMarketAndProduct(
    marketId: string,
    productIdentityId: string,
  ): Promise<MarketProductPrice | null>;
}

export interface SaveMarketProductPriceRepository {
  save(data: MarketProductPrice, transaction?: unknown): Promise<void>;
}

export type MarketProductPriceRepository = GetMarketProductPriceRepository &
  SaveMarketProductPriceRepository;
