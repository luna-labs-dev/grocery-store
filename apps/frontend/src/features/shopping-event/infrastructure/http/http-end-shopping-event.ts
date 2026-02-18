import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type {
  EndShoppingEventParams,
  EndShoppingEventResult,
} from '@/features/shopping-event/domain';

export const httpEndShoppingEvent = async ({
  shoppingEventId,
  params,
}: EndShoppingEventParams): Promise<EndShoppingEventResult> => {
  try {
    const response = await httpClient.put(
      `api/grocery-shopping/v1/shopping-event/end/${shoppingEventId}`,
      params,
    );

    return response.data;
  } catch (error) {
    console.error(error);
    if (isAxiosError(error)) {
      throw error.response?.data;
    }
    throw error;
  }
};
