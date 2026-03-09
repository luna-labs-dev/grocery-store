import axios, { type AxiosError } from 'axios';
import { env } from '@/config/env';
import type { HttpError } from '@/domain';
import { router } from '@/providers';

const { baseUrl } = env.backend;

export const httpClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

httpClient.interceptors.response.use(
  undefined,
  async (error: AxiosError<HttpError>) => {
    if (error.code === 'ERR_NETWORK' || !error.response) {
      const { code, message, name } = error;
      console.error({ code, message, name });
      throw {
        code,
        message,
      };
    }

    const { data } = error.response;

    if (
      data.code !== 'UNAUTHORIZED_ERROR' &&
      data.code !== 'USER_NOT_MEMBER_OF_ANY_GROUP_BARRIER_EXCEPTION'
    ) {
      console.error(data);
      throw error;
    }

    if (data.code === 'USER_NOT_MEMBER_OF_ANY_GROUP_BARRIER_EXCEPTION') {
      router.navigate({
        to: '/manage-groups',
        replace: true,
      });

      throw error;
    }

    throw error;
  },
);
