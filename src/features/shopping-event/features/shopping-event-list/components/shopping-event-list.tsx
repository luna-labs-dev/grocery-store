import { Icon } from '@iconify/react';
import { ShoppingEventItem } from './shopping-event-item';
import type { FetchShoppingEventListParams } from '@/features/shopping-event/domain';
import { useGetShoppingEventListQuery } from '@/features/shopping-event/infrastructure';

interface Props {
  paginationParams: FetchShoppingEventListParams;
}

export const ShoppingEventList = ({ paginationParams }: Props) => {
  const { data, isFetching, isError } =
    useGetShoppingEventListQuery(paginationParams);

  if (isFetching) {
    return (
      <div className="w-full h-64 flex items-center justify-center gap-1">
        <Icon
          icon={'material-symbols:refresh'}
          fontSize={24}
          className={'animate-spin'}
        />
        Carregando eventos de compra
      </div>
    );
  }

  if (isError) {
    return <div>Error loading data</div>;
  }

  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.items.map((se) => (
          <ShoppingEventItem key={se.id} shoppingEvent={se} />
        ))}
      </div>
    </div>
  );
};
