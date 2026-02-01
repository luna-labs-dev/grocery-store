import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type {
  AddProductToCartParams,
  AddProductToCartSuccessResult,
} from '@/features/shopping-event/domain';

export const httpAddProductToCart = async ({
  shoppingEventId,
  params,
}: AddProductToCartParams): Promise<AddProductToCartSuccessResult> => {
  try {
    const response = await httpClient.post(
      `api/grocery-shopping/v1/shopping-event/${shoppingEventId}/cart`,
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
