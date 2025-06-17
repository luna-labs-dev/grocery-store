import { Pagination } from '@/components';
import { FetchShoppingEventListParams } from '@/features/shopping-event/domain';
import { useGetShoppingEventListQuery } from '@/features/shopping-event/infrastructure';
import { useState } from 'react';

import { ShoppingEventItem } from './shopping-event-item';
import { StartShoppingEvent } from './start-shopping-event';

export const ShoppingEventList = () => {
  const [paginationParams, setPaginationParams] = useState<FetchShoppingEventListParams>({
    pageIndex: 0,
    pageSize: 4,
    orderBy: 'createdAt',
    orderDirection: 'asc',
  });

  const { data, status, isFetching } = useGetShoppingEventListQuery(paginationParams);

  if (status === 'error') {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <StartShoppingEvent />
        <Pagination
          paginationProps={{
            paginationParams,
            setPaginationParams,
            listTotal: data?.total,
            isFetching,
          }}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((se) => (
          <ShoppingEventItem key={se.id} shoppingEvent={se} />
        ))}
      </div>
    </div>
  );
};
