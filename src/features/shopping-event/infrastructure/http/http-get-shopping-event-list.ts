import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type {
  FetchShoppingEventListParams,
  ShoppingEventListResponse,
} from '@/features/shopping-event/domain';

export const httpGetShoppingEventList = async (
  params: FetchShoppingEventListParams,
): Promise<ShoppingEventListResponse> => {
  try {
    const response = await httpClient.get<ShoppingEventListResponse>(
      'api/grocery-shopping/v1/shopping-event',
      {
        params,
      },
    );

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(error);

      throw error.response?.data;
    }

    throw error;
  }
};
