import type { Market } from '@/domain';

export interface UpdateMarketRepository {
  update: (market: Market) => Promise<void>;
}
