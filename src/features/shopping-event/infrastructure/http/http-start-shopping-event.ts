import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type {
  StartShoppingEventParams,
  StartShoppingEventResult,
} from '@/features/shopping-event/domain';

export const httpStartShoppingEvent = async ({
  marketId,
}: StartShoppingEventParams): Promise<StartShoppingEventResult> => {
  try {
    const response = await httpClient.post(
      'api/grocery-shopping/v1/shopping-event/start',
      {
        marketId,
      },
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
