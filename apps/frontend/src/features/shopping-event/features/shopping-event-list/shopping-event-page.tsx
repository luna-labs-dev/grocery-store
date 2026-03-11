import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useGetShoppingEventListQuery } from '../../infrastructure';
import { ShoppingEventList } from './components/shopping-event-list';
import { Button } from '@/components';
import { Page } from '@/components/layout/page-layout';
import { CustomPagination } from '@/components/shared/pagination';
import type { GetShoppingEventListParams } from '@/infrastructure/api/types';
export const ShoppingEventPage = () => {
  const navigate = useNavigate();
  const [paginationParams, setPaginationParams] =
    useState<GetShoppingEventListParams>({
      pageIndex: 0,
      pageSize: 10,
      orderBy: 'createdAt',
      orderDirection: 'desc',
    });

  const { data, isLoading, isError } =
    useGetShoppingEventListQuery(paginationParams);
  return (
    <Page>
      <Page.Header className="p-4">
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
        </div>
      </Page.Header>
      <Page.Content className="pt-2 px-4 pb-4" scrollable={false}>
        <ShoppingEventList
          paginationParams={paginationParams}
          data={data}
          isLoading={isLoading}
          isError={isError}
          className="h-full"
        />
      </Page.Content>
      <Page.Footer className="p-4 border-t">
        <CustomPagination
          paginationProps={{
            paginationParams,
            setPaginationParams,
            listTotal: data?.total,
          }}
        />
      </Page.Footer>
    </Page>
  );
};
