import { Icon } from '@iconify/react';
import { useState } from 'react';
import { ProductSearch } from '../manual-search/components/product-search';
import { PriceConfirmationDrawer } from '../product-scan/components/price-confirmation-drawer';
import { ScannerOverlay } from '../product-scan/components/scanner-overlay';
import { useScanProduct } from '../product-scan/hooks/use-scan-product';
import {
  ShoppingEventDetailsHeader,
  ShoppingEventDetailsProducts,
  ShoppingEventDetailsTotals,
} from './components';
import { AddProductToCartDrawer } from './components/cart';
import { EndShoppingEventDrawer } from './components/end-shopping-event';
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
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  useGetShoppingEventByIdQuery,
  useShoppingSync,
} from '@/features/shopping-event/infrastructure';
import { cn } from '@/lib/utils';

interface ShoppingEventDetailsPageProps {
  shoppingEventId: string;
}

export const ShoppingEventDetailsPage = ({
  shoppingEventId,
}: ShoppingEventDetailsPageProps) => {
  useShoppingSync(shoppingEventId);

  const { data, refetch, isFetching } = useGetShoppingEventByIdQuery({
    shoppingEventId,
  });

  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const {
    scan,
    isScanning,
    scannedProduct,
    isDrawerOpen,
    setIsDrawerOpen,
    setScannedProduct,
    closeDrawer,
  } = useScanProduct();

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
    <Page.Content className="pt-2 px-4 pb-4 h-full" scrollable={true}>
      <div className="flex flex-col gap-4">
        <ShoppingEventDetailsTotals totals={data.totals} />
      </div>
    </Page.Content>
  );

  const productsTab = (
    <Page.Content className="pt-2 px-4 pb-4 rounded-xl" scrollable={false}>
      <ShoppingEventDetailsProducts
        products={data.products}
        shoppingEventId={data.id}
        shoppingEventStatus={data.status}
        refetch={refetch}
        isFetching={isFetching}
        className="h-full"
      />
    </Page.Content>
  );

  const tabs = [
    { value: 'totals', label: 'Totais', content: totalTab },
    { value: 'products', label: 'Produtos', content: productsTab },
  ];

  return (
    <Page className="p-0">
      <Tabs className="flex-1 flex flex-col min-h-0 gap-4">
        <Page.Header className="flex flex-col gap-4 p-4 pb-0">
          <ShoppingEventDetailsHeader shoppingEvent={data} />
          {data.status === 'ongoing' ? (
            <div className="flex justify-between">
              <div className="w-full flex justify-between">
                <Button variant={'outline'} onClick={() => refetch()}>
                  <Icon
                    icon={'material-symbols:refresh'}
                    fontSize={20}
                    className={cn(isFetching && 'animate-spin')}
                  />
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => setIsScannerVisible(!isScannerVisible)}
                  className={cn(
                    isScannerVisible && 'bg-primary text-primary-foreground',
                  )}
                >
                  <Icon icon="material-symbols:barcode-scanner" fontSize={20} />
                  {isScannerVisible ? 'Fechar Scanner' : 'Escanear'}
                </Button>
                <Button
                  variant={'outline'}
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Icon icon="material-symbols:search" fontSize={20} />
                  Digitar
                </Button>
                <AddProductToCartDrawer shoppingEventId={shoppingEventId}>
                  <Button variant={'outline'}>
                    <Cherry
                      animate
                      animation="default"
                      loop
                      loopDelay={1000 * 5}
                    />
                    Manual
                  </Button>
                </AddProductToCartDrawer>
              </div>
            </div>
          ) : null}

          <TabsList className="w-full flex-none">
            <TabsTrigger value="totals">Totais</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
          </TabsList>

          {isScannerVisible && (
            <div className="mt-4">
              <ScannerOverlay
                onScan={scan}
                isPaused={isScanning || isDrawerOpen}
              />
            </div>
          )}
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

      <PriceConfirmationDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        shoppingEventId={shoppingEventId}
        productData={
          scannedProduct as unknown as {
            name: string;
            brand?: string;
            imageUrl?: string;
            price?: number;
            weightInGrams?: number;
          }
        }
        onSuccess={() => {
          refetch();
          setIsScannerVisible(false);
          setIsSearchOpen(false);
        }}
      />

      <Drawer open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DrawerContent className="h-[80vh]">
          <DrawerHeader>
            <DrawerTitle>Buscar Produto</DrawerTitle>
          </DrawerHeader>
          <div className="p-4 flex-1 overflow-hidden">
            <ProductSearch
              onSelect={(product) => {
                setScannedProduct(product);
                setIsDrawerOpen(true);
              }}
              onCancel={() => setIsSearchOpen(false)}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {data.status === 'ongoing' ? (
        <Page.Footer className="flex justify-end p-4 border-t">
          <EndShoppingEventDrawer shoppingEventId={shoppingEventId}>
            <Button variant="outline">
              <CheckCheck
                animate
                animation="default"
                loop
                loopDelay={1000 * 5}
              />
              Finalizar Compra
            </Button>
          </EndShoppingEventDrawer>
        </Page.Footer>
      ) : null}
    </Page>
  );
};
