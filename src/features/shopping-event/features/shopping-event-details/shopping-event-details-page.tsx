import {
  ShoppingEventDetailsHeader,
  ShoppingEventDetailsProducts,
  ShoppingEventDetailsTotals,
} from './components';
import { Loading } from '@/components';
import { useGetShoppingEventByIdQuery } from '@/features/shopping-event/infrastructure';

export const ShoppingEventDetailsPage = ({
  shoppingEventId,
}: {
  shoppingEventId: string;
}) => {
  const { data, refetch, isFetching } = useGetShoppingEventByIdQuery({
    shoppingEventId,
  });

  if (!data && isFetching) {
    return (
      <div className="w-full h-64 flex items-center justify-center gap-1">
        <Loading text=" Carregando evento de compra" />
      </div>
    );
  }

  if (!data) {
    return <div>No data</div>;
  }

  return (
    <div className="flex flex-col gap-4 pt-2">
      <ShoppingEventDetailsHeader shoppingEvent={data} />
      <div className="flex flex-col">
        <ShoppingEventDetailsTotals calculatedTotals={data.calculatedTotals} />
        <ShoppingEventDetailsProducts
          products={data.products}
          shoppingEventId={data.id}
          shoppingEventStatus={data.status}
          refetch={refetch}
          isFetching={isFetching}
        />
      </div>
    </div>
  );
};
