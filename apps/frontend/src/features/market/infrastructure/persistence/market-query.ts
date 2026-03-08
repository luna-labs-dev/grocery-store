import { useEffect, useState } from 'react';
import { useGetPosition } from '@/components/shared/get-position';
import { useListMarkets } from '@/infrastructure/api/market.ts';
import type { ListMarketsParams } from '@/infrastructure/api/types';

export const useGetMarketListQuery = () => {
  const { location } = useGetPosition();
  const [params, setParams] = useState<ListMarketsParams>({
    location: {
      latitude: location.latitude,
      longitude: location.longitude,
    },
    expand: false,
    pageIndex: 0,
    pageSize: 10,
    orderBy: 'distance',
    orderDirection: 'asc',
  });

  console.log({ params });

  const query = useListMarkets(params, {
    query: {
      queryKey: ['get-market-list', params],
      staleTime: 1000 * 60 * 1,
      enabled:
        params.location?.latitude !== 0 && params.location?.longitude !== 0,
    },
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
