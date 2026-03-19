export interface PriceHistoryEntry {
  marketId: string;
  productIdentityId: string;
  price: number;
  verifiedAt: Date;
  consensusId: string;
}

export interface AddPriceHistoryRepository {
  add(entry: PriceHistoryEntry, transaction?: unknown): Promise<void>;
}

export type PriceHistoryRepository = AddPriceHistoryRepository;
