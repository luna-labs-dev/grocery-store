import { HttpError } from '@/domain';
import axios, { AxiosError } from 'axios';

import { env } from '@/config/env';
import { history } from '@/domain/utils/history';
import { clerk, loadClerkIfNeeded } from './clerk-client';

const { baseUrl } = env.backend;

console.log(baseUrl);

export const httpClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
});

httpClient.interceptors.response.use(undefined, async (error: AxiosError<HttpError>) => {
  if (
    error.response?.data?.code === 'UNAUTHORIZED_ERROR' &&
    error.response.data.requiredAction === 'add-user-to-family'
  ) {
    history.navigate('/family/onboarding');
  }
  console.log('before signout');

  await loadClerkIfNeeded();
  await clerk.signOut();

  throw error;
});
