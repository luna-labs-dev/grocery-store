import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type { MarketResponse, NewMarketParams } from '@/features/market';

export const httpNewMarket = async ({
  marketName,
}: NewMarketParams): Promise<MarketResponse> => {
  try {
    const response = await httpClient.post('api/grocery-shopping/v1/market', {
      marketName,
    });

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error);
      throw error.response?.data;
    }
    throw error;
  }
};
