import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { ShoppingEventItem } from './shopping-event-item';
import { Button, CustomPagination } from '@/components';
import type { FetchShoppingEventListParams } from '@/features/shopping-event/domain';
import { useGetShoppingEventListQuery } from '@/features/shopping-event/infrastructure';

export const ShoppingEventList = () => {
  const navigate = useNavigate();
  const [paginationParams, setPaginationParams] =
    useState<FetchShoppingEventListParams>({
      pageIndex: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    });

  const { data, status, isFetching } =
    useGetShoppingEventListQuery(paginationParams);

  if (status === 'error') {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Button
          onClick={() =>
            navigate({
              to: '/shopping-event/start-shopping-event',
            })
          }
        >
          Novo Evento
        </Button>
        <CustomPagination
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
