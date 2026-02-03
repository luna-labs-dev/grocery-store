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

  const { data, isError } = useGetShoppingEventListQuery(paginationParams);

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-center justify-between">
        <Button
          onClick={() =>
            navigate({
              to: '/shopping-event/start-shopping-event',
            })
          }
          className="w-full md:w-fit"
        >
          Novo Evento
        </Button>
        <CustomPagination
          paginationProps={{
            paginationParams,
            setPaginationParams,
            listTotal: data?.total,
          }}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isError ? (
          <div>Error loading data</div>
        ) : (
          data?.items.map((se) => (
            <ShoppingEventItem key={se.id} shoppingEvent={se} />
          ))
        )}
      </div>
    </div>
  );
};
