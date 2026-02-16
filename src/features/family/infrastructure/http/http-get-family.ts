import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type { Family } from '@/features/family';

export const httpGetFamily = async (): Promise<Family> => {
  try {
    const response = await httpClient.get('api/grocery-shopping/v1/family');

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};
