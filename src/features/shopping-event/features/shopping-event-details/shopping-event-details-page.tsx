import { Icon } from '@iconify/react';
import {
  ShoppingEventDetailsHeader,
  ShoppingEventDetailsProducts,
  ShoppingEventDetailsTotals,
} from './components';
import { AddProductToCartSheet } from './components/cart';
import { Button, Loading } from '@/components';
import { Page } from '@/components/layout/page-layout';
import { useGetShoppingEventByIdQuery } from '@/features/shopping-event/infrastructure';
import { cn } from '@/lib/utils';

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
    <Page>
      <Page.Header className="flex flex-col gap-4 px-4 pt-4">
        <ShoppingEventDetailsHeader shoppingEvent={data} />
        <ShoppingEventDetailsTotals calculatedTotals={data.calculatedTotals} />
        <div className="flex justify-between">
          <h3 className="text-xl font-bold ">Produtos</h3>
          {data.status === 'ONGOING' && (
            <div className="flex gap-1">
              <Button variant={'ghost'} onClick={() => refetch()}>
                <Icon
                  icon={'material-symbols:refresh'}
                  fontSize={20}
                  className={cn(isFetching && 'animate-spin')}
                />
              </Button>
              <AddProductToCartSheet shoppingEventId={shoppingEventId}>
                <Button variant={'ghost'}>
                  <Icon icon="fa:cart-plus" fontSize={20} />
                </Button>
              </AddProductToCartSheet>
            </div>
          )}
        </div>
      </Page.Header>
      <Page.Content className="p-4">
        <ShoppingEventDetailsProducts
          products={data.products}
          shoppingEventId={data.id}
          shoppingEventStatus={data.status}
          refetch={refetch}
          isFetching={isFetching}
        />
      </Page.Content>
    </Page>
  );
};
