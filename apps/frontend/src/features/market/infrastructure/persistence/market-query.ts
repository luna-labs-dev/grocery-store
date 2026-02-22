import { type FetchListParams, useQueryFactory } from '@/domain';
import type {
  GetMarketByIdParams,
  Market,
  MarketListResponse,
} from '@/features/market';
import {
  httpGetMarketById,
  httpGetMarketList,
} from '@/features/market/infrastructure';

export const useGetMarketListQuery = (params: FetchListParams) => {
  const query = useQueryFactory<FetchListParams, MarketListResponse>({
    queryKey: 'get-market-list',
    queryFunction: {
      fn: httpGetMarketList,
      params,
    },
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
  });

  return { ...query };
};

export const useGetMarketByIdQuery = (params: GetMarketByIdParams) => {
  const query = useQueryFactory<GetMarketByIdParams, Market>({
    queryKey: 'get-market-by-id',
    queryFunction: {
      fn: httpGetMarketById,
      params,
    },
    staleTime: 1000 * 60 * 10,
    enabled: !!params.marketId,
  });

  return { ...query };
};
