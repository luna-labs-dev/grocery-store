import { useMediaQuery } from '@mantine/hooks';
import type { ColumnDef } from '@tanstack/react-table';
import { Store } from 'lucide-react';
import { useMemo } from 'react';
import { MarketItem, StartShoppingButton } from './market-item';
import {
  Badge,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Skeleton,
  Spinner,
  TableSkeleton,
} from '@/components';
import { ResponsiveDataView } from '@/components/ui/responsive-data-view';
import type { ListMarkets200ItemsItem } from '@/infrastructure/api/types';

export function MarketListLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Spinner className="size-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Carregando lista de mercados
      </p>
    </div>
  );
}

export function MarketListSkeleton({ count = 6 }: { count?: number }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return <TableSkeleton columnCount={4} rowCount={count} />;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => {
        const key = i + 1;
        return (
          <Card
            key={`market-skele-${key}`}
            className="flex flex-col h-full p-3 sm:p-4 rounded-lg gap-2 sm:gap-3"
          >
            <CardHeader className="p-0">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5 w-full">
                  <Skeleton className="h-5 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
                <Skeleton className="h-5 w-16 rounded-full shrink-0" />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 p-0 justify-center">
              <div className="flex items-start gap-1.5 mt-1 sm:mt-2">
                <Skeleton className="size-3.5 sm:size-4 shrink-0 rounded" />
                <div className="flex flex-col gap-1 w-full">
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-2/3 rounded" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-0 mt-2 sm:mt-auto">
              <div className="flex w-full justify-end">
                <Skeleton className="h-8 w-28 rounded-md" />
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}

export function MarketListError() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Store />
        </EmptyMedia>
        <EmptyTitle>Erro ao carregar</EmptyTitle>
        <EmptyDescription>
          Ocorreu um erro ao buscar os mercados. Tente novamente.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

export function MarketListEmpty() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Store />
        </EmptyMedia>
        <EmptyTitle>Nenhum mercado encontrado</EmptyTitle>
        <EmptyDescription>
          Altere os filtros de busca para encontrar mercados.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

import type { FetchListResponse } from '@/domain';

interface MarketListProps {
  data?: FetchListResponse<ListMarkets200ItemsItem>;
  isLoading?: boolean;
  isError?: boolean;
  pageSize?: number;
  className?: string;
}

export const MarketList = ({
  data: propsData,
  isLoading: propsIsLoading,
  isError: propsIsError,
  pageSize: propsPageSize,
  className,
}: MarketListProps) => {
  const columns = useMemo<ColumnDef<ListMarkets200ItemsItem>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Nome do Mercado',
      },
      {
        id: 'location',
        header: 'Localização',
        cell: ({ row }) => {
          const market = row.original;
          return (
            <span className="text-muted-foreground">
              {[market.neighborhood, market.city].filter(Boolean).join(' - ')}
            </span>
          );
        },
      },
      {
        accessorKey: 'distance',
        header: 'Distância',
        cell: ({ row }) => {
          const distance = row.getValue('distance') as number | undefined;
          if (distance === undefined) return '-';

          let variant: 'success' | 'info' | 'warning' = 'warning';
          if (distance <= 1000) variant = 'success';
          else if (distance <= 5000) variant = 'info';

          return (
            <Badge
              variant={variant}
              className="whitespace-nowrap px-2 py-0 text-xs text-nowrap w-fit"
            >
              {(distance / 1000).toFixed(1)} km
            </Badge>
          );
        },
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <div className="flex justify-end pr-2">
            <StartShoppingButton
              market={row.original}
              variant="ghost"
              iconOnly={true}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const data = propsData;
  const isLoading = propsIsLoading;
  const isError = propsIsError;
  const pageSize = propsPageSize ?? 6;

  if (isLoading) {
    return <MarketListSkeleton count={pageSize} />;
  }

  if (isError) {
    return <MarketListError />;
  }

  if (!data?.items?.length) {
    return <MarketListEmpty />;
  }

  return (
    <ResponsiveDataView
      data={data?.items || []}
      columns={columns}
      MobileCard={({ data: market }) => <MarketItem market={market} />}
      keyExtractor={(market) => market.id}
      emptyMessage="Nenhum mercado encontrado"
      className={className}
    />
  );
};
