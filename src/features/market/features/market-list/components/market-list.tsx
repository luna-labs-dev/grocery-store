import { useState } from 'react';
import { MarketItem } from './market-item';
import { CustomPagination } from '@/components';
import type { FetchListParams } from '@/domain';
import { useGetMarketListQuery } from '@/features/market/infrastructure';

export const MarketList = () => {
  const [paginationParams, setPaginationParams] = useState<FetchListParams>({
    pageIndex: 0,
    pageSize: 1,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });

  const { data } = useGetMarketListQuery(paginationParams);

  return (
    <div>
      <CustomPagination
        paginationProps={{
          paginationParams,
          setPaginationParams,
          listTotal: data?.total,
        }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((item) => (
          <MarketItem key={item.id} market={item} />
        ))}
      </div>
    </div>
  );
};
