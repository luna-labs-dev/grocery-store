import { useEffect, useState } from 'react';
import { useGetPosition } from '@/components/shared/get-position';
import { useQueryFactory } from '@/domain';
import type {
  GetMarketByIdParams,
  GetMarketListParams,
  Market,
  MarketListResponse,
} from '@/features/market';
import {
  httpGetMarketById,
  httpGetMarketList,
} from '@/features/market/infrastructure';

export const useGetMarketListQuery = () => {
  const { location } = useGetPosition();
  const [params, setParams] = useState<GetMarketListParams>({
    location: {
      latitude: location?.latitude ?? 0,
      longitude: location?.longitude ?? 0,
    },
    expand: false,
    pageIndex: 0,
    pageSize: 10,
    orderBy: 'distance',
    orderDirection: 'asc',
  });

  const query = useQueryFactory<GetMarketListParams, MarketListResponse>({
    queryKey: 'get-market-list',
    queryFunction: {
      fn: httpGetMarketList,
      params,
    },
    staleTime: 1000 * 60 * 1,
    keepPreviousData: true,
    enabled:
      params.location?.latitude !== 0 && params.location?.longitude !== 0,
  });

  useEffect(() => {
    if (location) {
      setParams((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          ...location,
        },
      }));
    }
  }, [location]);

  return {
    ...query,
    setParams,
    params,
  };
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
