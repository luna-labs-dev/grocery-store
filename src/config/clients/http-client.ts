import { HttpError } from '@/domain';
import axios, { AxiosError } from 'axios';

import { env } from '@/config/env';
import { history } from '@/domain/utils/history';
import { clerk, loadClerkIfNeeded } from './clerk-client';

const { baseUrl } = env.backend;

export const httpClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

httpClient.interceptors.response.use(undefined, async (error: AxiosError<HttpError>) => {
  if (error.code === 'ERR_NETWORK' || !error.response) {
    const { code, message, name } = error;
    console.error({ code, message, name });
    throw {
      code,
      message,
    };
  }

  const { data } = error.response;

  if (data.code !== 'UNAUTHORIZED_ERROR') {
    console.error(data);
    throw error;
  }

  if (data.requiredAction === 'add-user-to-family') {
    history.navigate('/family/onboarding');
    throw error;
  }

  await loadClerkIfNeeded();
  await clerk.signOut();
});
