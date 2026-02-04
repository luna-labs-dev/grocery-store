import { Icon } from '@iconify/react';
import { useState } from 'react';
import { MarketItem } from './market-item';
import { CustomPagination } from '@/components';
import type { FetchListParams } from '@/domain';
import { useGetMarketListQuery } from '@/features/market/infrastructure';

export const MarketList = () => {
  const [paginationParams, setPaginationParams] = useState<FetchListParams>({
    pageIndex: 0,
    pageSize: 10,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });

  const { data, isFetching } = useGetMarketListQuery(paginationParams);

  if (isFetching) {
    return (
      <div className="w-full h-64 flex items-center justify-center gap-1">
        <Icon
          icon={'material-symbols:refresh'}
          fontSize={24}
          className={'animate-spin'}
        />
        Carregando Mercados
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
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
