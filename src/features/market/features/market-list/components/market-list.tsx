import { MarketItem } from './market-item';
import { Loading } from '@/components';
import type { FetchListParams } from '@/domain';
import { useGetMarketListQuery } from '@/features/market/infrastructure';

interface MarketListProps {
  paginationParams: FetchListParams;
}

export const MarketList = ({ paginationParams }: MarketListProps) => {
  const { data, isFetching } = useGetMarketListQuery(paginationParams);

  if (isFetching) {
    return (
      <div className="w-full h-64 flex items-center justify-center gap-1">
        <Loading text="Carregando lista de mercados" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((item) => (
          <MarketItem key={item.id} market={item} />
        ))}
      </div>
    </div>
  );
};
