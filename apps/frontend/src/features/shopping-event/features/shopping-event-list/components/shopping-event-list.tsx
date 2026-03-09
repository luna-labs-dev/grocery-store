'use client';

import { useMediaQuery } from '@mantine/hooks';
import { Link } from '@tanstack/react-router';
import type { ColumnDef } from '@tanstack/react-table';
import { ChevronRight, ShoppingBasket } from 'lucide-react';
import { ShoppingEventItem } from './shopping-event-item';
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Separator,
  Skeleton,
  Spinner,
  TableSkeleton,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components';
import { ResponsiveDataView } from '@/components/ui/responsive-data-view';
import { useGetShoppingEventListQuery } from '@/features/shopping-event/infrastructure';
import type {
  GetShoppingEventList200ItemsItem,
  GetShoppingEventListParams,
} from '@/infrastructure/api/types';

function ShoppingEventListLoading() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Spinner className="size-5 text-muted-foreground" />
      <p className="text-sm text-muted-foreground">
        Carregando eventos de compra
      </p>
    </div>
  );
}

function ShoppingEventListSkeleton({ count = 4 }: { count?: number }) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  if (isDesktop) {
    return <TableSkeleton columnCount={5} rowCount={count} />;
  }

  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, i) => {
        const key = i + 1;
        return (
          <Card key={`se-skele-${key}`} className="gap-2 py-3">
            <CardHeader className="gap-0.5 px-3 py-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2 w-full">
                  <Skeleton className="size-3.5 rounded shrink-0" />
                  <Skeleton className="h-4 w-1/3 rounded" />
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Skeleton className="h-4 w-20 rounded-full" />
                  <Skeleton className="size-3.5 rounded" />
                </div>
              </div>
            </CardHeader>

            <Separator className="my-2" />

            <CardContent className="px-3 py-0">
              <div className="grid grid-cols-3 gap-x-3 gap-y-2">
                {[1, 2, 3, 4, 5, 6].map((key) => (
                  <div
                    key={`stat-skele-${key}`}
                    className="flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-1">
                      <Skeleton className="size-2.5 rounded shrink-0" />
                      <Skeleton className="h-2 w-10 rounded" />
                    </div>
                    <Skeleton className="h-3 w-14 rounded" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ShoppingEventListError() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBasket />
        </EmptyMedia>
        <EmptyTitle>Erro ao carregar</EmptyTitle>
        <EmptyDescription>
          Ocorreu um erro ao buscar os eventos de compra. Tente novamente.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function ShoppingEventListEmpty() {
  return (
    <Empty className="py-16">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <ShoppingBasket />
        </EmptyMedia>
        <EmptyTitle>Nenhum evento encontrado</EmptyTitle>
        <EmptyDescription>
          Crie um novo evento de compra para comecar.
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

interface Props {
  paginationParams: GetShoppingEventListParams;
  data?: any;
  isLoading?: boolean;
  isError?: boolean;
}
export function ShoppingEventList({
  paginationParams,
  data: propsData,
  isLoading: propsIsLoading,
  isError: propsIsError,
}: Props) {
  const {
    data: queryData,
    isLoading: queryIsLoading,
    isError: queryIsError,
  } = useGetShoppingEventListQuery(paginationParams);

  const data = propsData ?? queryData;
  const isLoading = propsIsLoading ?? queryIsLoading;
  const isError = propsIsError ?? queryIsError;
  if (isLoading) {
    return <ShoppingEventListSkeleton count={paginationParams.pageSize} />;
  }

  if (isError) {
    return <ShoppingEventListError />;
  }

  if (!data?.items?.length) {
    return <ShoppingEventListEmpty />;
  }

  const { items } = data;

  const STATUS_CONFIG: Record<
    string,
    {
      label: string;
      variant:
        | 'default'
        | 'error'
        | 'info'
        | 'success'
        | 'warning'
        | 'outline'
        | 'secondary'
        | 'destructive'
        | null
        | undefined;
    }
  > = {
    CANCELLED: { label: 'Cancelado', variant: 'error' },
    ONGOING: { label: 'Em andamento', variant: 'info' },
    FINISHED: { label: 'Concluido', variant: 'success' },
  };

  const columns: ColumnDef<GetShoppingEventList200ItemsItem>[] = [
    {
      accessorKey: 'market',
      header: 'Mercado',
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const config = STATUS_CONFIG[row.original.status] ?? {
          label: row.original.status,
          variant: 'outline',
        };
        return (
          <Badge variant={config.variant} className="text-[10px] px-1.5 py-0">
            {config.label}
          </Badge>
        );
      },
    },
    {
      id: 'totals',
      header: 'Total Varejo',
      cell: ({ row }) => {
        if (!row.original.totals.retailTotal) return '-';
        return row.original.totals.retailTotal.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });
      },
    },
    {
      id: 'date',
      header: 'Data',
      cell: ({ row }) => {
        return new Date(row.original.createdAt).toLocaleDateString('pt-BR');
      },
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <Link
            to="/shopping-event/$shoppingEventId"
            params={{ shoppingEventId: row.original.id }}
          >
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="size-8">
                    <ChevronRight className="size-4 text-muted-foreground" />
                    <span className="sr-only">Ver detalhes</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">Ver detalhes</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <ResponsiveDataView
      data={items}
      columns={columns}
      MobileCard={({ data: se }) => <ShoppingEventItem shoppingEvent={se} />}
      keyExtractor={(se) => se.id}
      emptyMessage="Nenhum evento de compra encontrado."
    />
  );
}

export {
  ShoppingEventListLoading,
  ShoppingEventListSkeleton,
  ShoppingEventListError,
  ShoppingEventListEmpty,
};
