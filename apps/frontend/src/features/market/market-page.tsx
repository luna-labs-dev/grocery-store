import { useState } from 'react';
import { MarketList } from './components/market-list';
import { useGetMarketListQuery } from './infrastructure';
import { Button, CustomPagination } from '@/components';
import { Page } from '@/components/layout/page-layout';
import type { FetchListParams } from '@/domain';

export const MarketPage = () => {
  const [paginationParams, setPaginationParams] = useState<FetchListParams>({
    pageIndex: 0,
    pageSize: 10,
    orderBy: 'createdAt',
    orderDirection: 'desc',
  });

  const { data } = useGetMarketListQuery(paginationParams);

  return (
    <Page>
      <Page.Header className="p-4">
        <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-0">
          <Button className="w-full">Novo Mercado</Button>
        </div>
      </Page.Header>
      <Page.Content className="px-4">
        <MarketList paginationParams={paginationParams} />
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
