import type {
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';
import { ProductItem } from './shopping-event-product-item';
import type {
  Product,
  ShoppingEventStatus,
} from '@/features/shopping-event/domain';

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
