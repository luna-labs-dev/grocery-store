import { Icon } from '@iconify/react';
import type {
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AddProductToCartSheet,
  RemoveProductFromCartDialog,
  UpdateProductInCartSheet,
} from './cart';
import { Button, KeyValue, ScrollArea } from '@/components';
import { fCurrency } from '@/domain';
import type {
  Product,
  ShoppingEventStatus,
} from '@/features/shopping-event/domain';
import { cn } from '@/lib/utils';

interface ShoppingEventDetailsProductsProps {
  products: Product[];
  shoppingEventId: string;
  shoppingEventStatus: ShoppingEventStatus;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, any>>;
  isFetching: boolean;
}

export const ShoppingEventDetailsProducts = ({
  products,
  shoppingEventId,
  shoppingEventStatus,
  refetch,
  isFetching,
}: ShoppingEventDetailsProductsProps) => {
  return (
    <section className="flex flex-col flex-1 min-h-0">
      <div className="flex justify-between">
        <h3 className="text-xl font-bold ">Produtos</h3>
        {shoppingEventStatus === 'ONGOING' && (
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

      <ScrollArea type="scroll" className="flex flex-col gap-2 flex-1 min-h-0">
        <div className="flex flex-col gap-2 p-4 pb-10">
          {products.map((product) => {
            return (
              <div
                key={product.id}
                className="flex flex-col gap-2 py-2 px-3 border rounded-lg w-full"
              >
                <div className="flex justify-between ">
                  <p className="text-sm">{product.name}</p>
                  <p className="text-sm">
                    {format(product.addedAt, 'HH:mm:ss', { locale: ptBR })}
                  </p>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-4 xl:grid-cols-8 gap-2">
                  <KeyValue
                    props={{
                      title: 'Quantidade',
                      text: product.amount.toString(),
                    }}
                  />

                  <KeyValue
                    className="px-2 py-1"
                    props={{
                      title: 'Preço',
                      text: fCurrency(product.price ?? 0),
                    }}
                  />

                  <KeyValue
                    className="px-2 py-1"
                    props={{
                      title: 'Total',
                      text: fCurrency(product.totalRetailPrice),
                    }}
                  />

                  {product.wholesaleMinAmount && (
                    <KeyValue
                      className="px-2 py-1"
                      props={{
                        title: 'Mín. atacado',
                        text: (product.wholesaleMinAmount ?? 0).toString(),
                      }}
                    />
                  )}

                  {product.wholesalePrice && (
                    <KeyValue
                      className="px-2 py-1"
                      props={{
                        title: 'Preço atacado',
                        text: fCurrency(product.wholesalePrice ?? 0),
                      }}
                    />
                  )}

                  {product.totalWholesalePrice && product.wholesalePrice && (
                    <KeyValue
                      className="px-2 py-1"
                      props={{
                        title: 'Total atacado',
                        text: fCurrency(product.totalWholesalePrice),
                      }}
                    />
                  )}

                  {product.totalDifference && product.wholesalePrice && (
                    <KeyValue
                      className="px-2 py-1"
                      props={{
                        title: 'Economia',
                        text: fCurrency(product.totalDifference),
                      }}
                    />
                  )}
                </div>
                {shoppingEventStatus === 'ONGOING' && (
                  <div className="flex justify-end gap-2">
                    <UpdateProductInCartSheet
                      shoppingEventId={shoppingEventId}
                      product={product}
                    >
                      <Button size="sm">
                        <Icon icon="mingcute:edit-2-line" />
                      </Button>
                    </UpdateProductInCartSheet>
                    <RemoveProductFromCartDialog
                      shoppingEventId={shoppingEventId}
                      product={product}
                    >
                      <Button size="sm" variant="destructive">
                        <Icon icon="mingcute:delete-2-line" />
                      </Button>
                    </RemoveProductFromCartDialog>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </section>
  );
};
