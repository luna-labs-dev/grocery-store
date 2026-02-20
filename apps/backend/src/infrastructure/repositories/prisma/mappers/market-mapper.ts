import type { market } from '@prisma/client';
import { Market } from '@/domain';

type MarketPersistence = market;

export const MarketMapper = {
  toDomain: (raw: MarketPersistence): Market => {
    return Market.create(
      {
        code: raw.code,
        name: raw.name,
        createdAt: raw.createdAt,
        createdBy: raw.createdBy,
      },
      raw.id,
    );
  },

  toPersistence: (market: Market): MarketPersistence => {
    return {
      id: market.id,
      code: market.code,
      name: market.name,
      createdAt: market.createdAt,
      createdBy: market.createdBy,
    };
  },
};
