import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useGetShoppingEventListQuery } from '../../infrastructure';
import { ShoppingEventList } from './components/shopping-event-list';
import { Button, CustomPagination } from '@/components';
import type { FetchShoppingEventListParams } from '@/features/shopping-event/domain';
export const ShoppingEventPage = () => {
  const navigate = useNavigate();
  const [paginationParams, setPaginationParams] =
    useState<FetchShoppingEventListParams>({
      pageIndex: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    });

  const { data } = useGetShoppingEventListQuery(paginationParams);
  return (
    <div className="flex flex-col gap-4">
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
      <ShoppingEventList paginationParams={paginationParams} />
    </div>
  );
};
