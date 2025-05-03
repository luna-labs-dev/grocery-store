import { HttpError } from '@/domain';
import axios, { AxiosError } from 'axios';

import { env } from '@/config/env';
import { history } from '@/domain/utils/history';

const { baseUrl } = env.backend;

console.log(baseUrl);

export const httpClient = axios.create({
  baseURL: baseUrl,
});

httpClient.interceptors.response.use(undefined, (error: AxiosError<HttpError>) => {
  if (
    error.response?.data?.code === 'UNAUTHORIZED_ERROR' &&
    error.response.data.requiredAction === 'add-user-to-family'
  ) {
    history.navigate('/family/onboarding');
  }

  throw error;
});
