import type { AxiosError, AxiosRequestConfig } from 'axios';
import qs from 'qs';
import { groupStorage } from '../../infrastructure/storage/group-storage';
import { httpClient } from './http-client';

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const activeGroupId = groupStorage.getActiveGroupId();
  const headers = {
    ...config.headers,
    ...options?.headers,
    ...(activeGroupId ? { 'x-group-id': activeGroupId } : {}),
  };

  const promise = httpClient({
    ...config,
    ...options,
    headers,
    paramsSerializer: (params) => qs.stringify(params),
  }).then(({ data }) => data);

  return promise;
};

// Override the return error type for react-query and swr
export type ErrorType<Error> = AxiosError<Error>;
// Standard body type
export type BodyType<BodyData> = BodyData;
// Or wrap the body type if processing data before sending
// export type BodyType<BodyData> = CamelCase<BodyData>;
