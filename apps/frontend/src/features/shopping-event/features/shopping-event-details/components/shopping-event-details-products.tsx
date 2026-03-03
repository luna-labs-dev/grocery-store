import type {
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';
import { ProductItem } from './shopping-event-product-item';
import type { ShoppingEventStatus } from '@/features/shopping-event/domain';
import type { GetShoppingEventById200ProductsItem } from '@/infrastructure/api/types';

interface ShoppingEventDetailsProductsProps {
  products: GetShoppingEventById200ProductsItem[];
  shoppingEventId: string;
  shoppingEventStatus: ShoppingEventStatus;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, any>>;
  isFetching: boolean;
}

export const ShoppingEventDetailsProducts = ({
  products,
  shoppingEventId,
  shoppingEventStatus,
}: ShoppingEventDetailsProductsProps) => {
  return (
    <section className="flex flex-col gap-4">
      {products.map((product) => {
        return (
          <ProductItem
            key={product.id}
            product={product}
            shoppingEventId={shoppingEventId}
            shoppingEventStatus={shoppingEventStatus}
          />
        );
      })}
    </section>
  );
};
