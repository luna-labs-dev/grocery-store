import { Icon } from '@iconify/react';
import type {
  QueryObserverResult,
  RefetchOptions,
} from '@tanstack/react-query';
import type { ColumnDef } from '@tanstack/react-table';
import { RemoveProductFromCartDrawer, UpdateProductInCartDrawer } from './cart';
import { ProductItem } from './shopping-event-product-item';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';
import { ResponsiveDataView } from '@/components/ui/responsive-data-view';
import { fCurrency } from '@/domain';
import type {
  GetShoppingEventById200ProductsItem,
  GetShoppingEventById200Status,
} from '@/infrastructure/api/types';

interface ShoppingEventDetailsProductsProps {
  products: GetShoppingEventById200ProductsItem[];
  shoppingEventId: string;
  shoppingEventStatus: GetShoppingEventById200Status;
  refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<any, any>>;
  isFetching: boolean;
  className?: string;
}

export const ShoppingEventDetailsProducts = ({
  products,
  shoppingEventId,
  shoppingEventStatus,
  className,
}: ShoppingEventDetailsProductsProps) => {
  const isOngoing = shoppingEventStatus === 'ongoing';

  const columns: ColumnDef<GetShoppingEventById200ProductsItem>[] = [
    {
      accessorKey: 'name',
      header: 'Produto',
      cell: ({ row }) => <div className="font-medium">{row.original.name}</div>,
    },
    {
      accessorKey: 'amount',
      header: 'Qtd.',
      cell: ({ row }) => row.original.amount ?? 0,
    },
    {
      accessorKey: 'price',
      header: 'Varejo (Un)',
      cell: ({ row }) => fCurrency(row.original.price ?? 0),
    },
    {
      accessorKey: 'totalRetailPrice',
      header: 'Total Varejo',
      cell: ({ row }) => (
        <span className="font-semibold">
          {fCurrency(row.original.totalRetailPrice)}
        </span>
      ),
    },
    {
      accessorKey: 'wholesaleMinAmount',
      header: 'Mín. Atacado',
      cell: ({ row }) => {
        return row.original.wholesaleMinAmount ?? '-';
      },
    },
    {
      accessorKey: 'wholesalePrice',
      header: 'Atacado (Un)',
      cell: ({ row }) => {
        if (!row.original.wholesalePrice) return '-';
        return fCurrency(row.original.wholesalePrice);
      },
    },
    {
      accessorKey: 'totalWholesalePrice',
      header: 'Total Atacado',
      cell: ({ row }) => {
        if (!row.original.totalWholesalePrice) return '-';
        return (
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
            {fCurrency(row.original.totalWholesalePrice)}
          </span>
        );
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        if (!isOngoing) return null;
        return (
          <div className="flex shrink-0 items-center justify-end gap-1">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <UpdateProductInCartDrawer
                    shoppingEventId={shoppingEventId}
                    product={row.original}
                  >
                    <Button size="icon" variant="ghost" className="size-8">
                      <Icon icon="mingcute:edit-2-line" className="size-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                  </UpdateProductInCartDrawer>
                </TooltipTrigger>
                <TooltipContent side="bottom">Editar</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <RemoveProductFromCartDrawer
                    shoppingEventId={shoppingEventId}
                    product={row.original}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Icon icon="mingcute:delete-2-line" className="size-4" />
                      <span className="sr-only">Remover</span>
                    </Button>
                  </RemoveProductFromCartDrawer>
                </TooltipTrigger>
                <TooltipContent side="bottom">Remover</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        );
      },
    },
  ];

  return (
    <ResponsiveDataView
      data={products}
      columns={columns}
      MobileCard={({ data }) => (
        <ProductItem
          product={data}
          shoppingEventId={shoppingEventId}
          shoppingEventStatus={shoppingEventStatus}
        />
      )}
      keyExtractor={(product) => product.id}
      emptyMessage="Nenhum produto no carrinho."
      dense={true}
      className={className}
    />
  );
};
