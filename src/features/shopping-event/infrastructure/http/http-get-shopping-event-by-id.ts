import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type {
  GetShoppingEventByIdParams,
  ShoppingEvent,
} from '@/features/shopping-event/domain';

export const httpGetShoppingEventById = async ({
  shoppingEventId,
}: GetShoppingEventByIdParams): Promise<ShoppingEvent> => {
  try {
    const response = await httpClient.get<ShoppingEvent>(
      `api/grocery-shopping/v1/shopping-event/${shoppingEventId}`,
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
