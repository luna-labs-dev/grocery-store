import { useQuery } from '@tanstack/react-query';

export interface UseQueryFactory<HttpParams, HttpResponse> {
  queryKey: string;
  queryFunction: {
    fn: (params: HttpParams) => Promise<HttpResponse>;
    params: HttpParams;
  };
  staleTime?: number;
  refetchInterval?: number;
  retry?: boolean | number;
  enabled?: boolean;
  keepPreviousData?: boolean;
}

export const useQueryFactory = <HttpParams, HttpResponse>({
  queryKey,
  queryFunction: { fn, params },
  staleTime,
  refetchInterval,
  retry,
  enabled,
  keepPreviousData,
}: UseQueryFactory<HttpParams, HttpResponse>) => {
  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: ({ queryKey }) => fn(queryKey[1] as HttpParams),
    retry,
    refetchOnWindowFocus: true,
    enabled: enabled ?? true,
    staleTime,
    refetchInterval,

    placeholderData: (previousData) =>
      keepPreviousData ? previousData : undefined,
  });

  return { ...query };
};
