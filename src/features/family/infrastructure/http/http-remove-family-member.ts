import { isAxiosError } from 'axios';
import { httpClient } from '@/config/clients';
import type { RemoveFamilyMemberParams } from '@/features/family';

export const httpRemoveFamilyMember = async ({
  userToBeRemovedId,
}: RemoveFamilyMemberParams): Promise<void> => {
  try {
    await httpClient.put<void>('api/grocery-shopping/v1/family/remove', {
      userToBeRemovedId,
    });
  } catch (error) {
    if (isAxiosError(error)) {
      throw error.response?.data;
    }

    throw error;
  }
};
