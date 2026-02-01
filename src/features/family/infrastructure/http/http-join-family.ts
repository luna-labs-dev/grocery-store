import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type { JoinFamilyParams } from '@/features/family';

export const httpJoinFamily = async (params: JoinFamilyParams) => {
  try {
    const response = await httpClient.post(
      'api/grocery-shopping/v1/family/join',
      params,
    );

    return response.data;
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};
