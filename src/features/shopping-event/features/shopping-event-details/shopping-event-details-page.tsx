import { Icon } from '@iconify/react';
import {
  ShoppingEventDetailsHeader,
  ShoppingEventDetailsProducts,
  ShoppingEventDetailsTotals,
} from './components';
import { AddProductToCartSheet } from './components/cart';
import { EndShoppingEventDialog } from './components/end-shopping-event';
import { Button, Loading } from '@/components';
import {
  Tabs,
  TabsContent,
  TabsContents,
  TabsList,
  TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { CheckCheck } from '@/components/animate-ui/icons/check-check';
import { Cherry } from '@/components/animate-ui/icons/cherry';
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

  const totalTab = (
    <Page.Content>
      <div className="flex flex-col gap-2">
        <ShoppingEventDetailsTotals totals={data.totals} />
      </div>
    </Page.Content>
  );

  const productsTab = (
    <Page.Content className="pb-4 rounded-xl">
      <ShoppingEventDetailsProducts
        products={data.products}
        shoppingEventId={data.id}
        shoppingEventStatus={data.status}
        refetch={refetch}
        isFetching={isFetching}
      />
    </Page.Content>
  );

  const tabs = [
    { value: 'totals', label: 'Totais', content: totalTab },
    { value: 'products', label: 'Produtos', content: productsTab },
  ];

  return (
    <Page className="px-4 py-2">
      <Tabs className="flex-1 flex flex-col min-h-0 gap-4">
        <Page.Header className="flex flex-col gap-4">
          <ShoppingEventDetailsHeader shoppingEvent={data} />
          {data.status === 'ONGOING' ? (
            <div className="flex justify-between">
              <div className="w-full flex justify-between">
                <Button variant={'outline'} onClick={() => refetch()}>
                  <Icon
                    icon={'material-symbols:refresh'}
                    fontSize={20}
                    className={cn(isFetching && 'animate-spin')}
                  />
                </Button>
                <AddProductToCartSheet shoppingEventId={shoppingEventId}>
                  <Button variant={'outline'}>
                    <Cherry
                      animate
                      animation="default"
                      loop
                      loopDelay={1000 * 5}
                    />
                    Adicionar Produto
                  </Button>
                </AddProductToCartSheet>
              </div>
            </div>
          ) : null}

          <TabsList className="w-full flex-none">
            <TabsTrigger value="totals">Totais</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
          </TabsList>
        </Page.Header>

        <TabsContents
          className="flex-1 min-h-0 [&>div]:h-full"
          animate={{ height: '100%' }}
        >
          {tabs.map((tab) => (
            <TabsContent
              key={tab.value}
              value={tab.value}
              className="h-full flex flex-col min-h-0 overflow-hidden"
            >
              {tab.content}
            </TabsContent>
          ))}
        </TabsContents>
      </Tabs>
      {data.status === 'ONGOING' ? (
        <Page.Footer className="flex justify-end pt-4 pb-2">
          <EndShoppingEventDialog shoppingEventId={shoppingEventId}>
            <Button variant="outline">
              <CheckCheck
                animate
                animation="default"
                loop
                loopDelay={1000 * 5}
              />
              Finalizar Compra
            </Button>
          </EndShoppingEventDialog>
        </Page.Footer>
      ) : null}
    </Page>
  );
};
