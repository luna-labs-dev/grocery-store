import { useEffect, useState } from 'react';
import { MarketList } from './components/market-list';
import type { GetMarketListParams } from './domain';
import { useGetMarketListQuery } from './infrastructure';
import { Button, CustomPagination } from '@/components';
import { Page } from '@/components/layout/page-layout';
import { useGetPosition } from '@/hooks';

export const MarketPage = () => {
  const { location, getPosition } = useGetPosition();
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

  useEffect(() => {
    getPosition();
  }, []);

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

  const { data } = useGetMarketListQuery(params);

  return (
    <Page>
      <Page.Header className="p-4">
        <div className="flex flex-col justify-end gap-2 sm:flex-row sm:gap-0">
          <Button
            className="w-full"
            onClick={() => setParams((prev) => ({ ...prev, expand: true }))}
          >
            Expandir Busca
          </Button>
        </div>
      </Page.Header>
      <Page.Content className="px-4">
        <MarketList paginationParams={params} />
      </Page.Content>
      <Page.Footer className="p-4 border-t">
        <CustomPagination
          paginationProps={{
            paginationParams: params,
            setPaginationParams: setParams,
            listTotal: data?.total,
          }}
          totalItemsPerPageOptions={[10, 25, 50]}
        />
      </Page.Footer>
    </Page>
  );
};
