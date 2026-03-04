import type { MarketDto } from './market-schemas';
import type { Market } from '@/domain';

export const marketMapper = {
  toResponse(market: Market): MarketDto {
    return {
      id: market.id,
      name: market.name,
      formattedAddress: market.formattedAddress,
      city: market.city,
      neighborhood: market.neighborhood,
      latitude: market.latitude,
      longitude: market.longitude,
      distance: market.distance,
      createdAt: market.createdAt,
      lastUpdatedAt: market.lastUpdatedAt,
    };
  },

  toResponseList(markets: Market[]): MarketDto[] {
    return markets.map((market) => this.toResponse(market));
  },
};
