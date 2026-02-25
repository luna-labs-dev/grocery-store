import { Store } from 'lucide-react';
import { MarketItem } from './market-item';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Skeleton,
  Spinner,
} from '@/components';
import { useGetMarketListQuery } from '@/features/market/infrastructure';

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

export function MarketListSkeleton() {
  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: is just a skeleton
        <Skeleton key={i} className="h-[180px] w-full rounded-xl" />
      ))}
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

export const MarketList = () => {
  const { data, isLoading, isError } = useGetMarketListQuery();

  if (isLoading) {
    return <MarketListLoading />;
  }

  if (isError) {
    return <MarketListError />;
  }

  if (!data?.items?.length) {
    return <MarketListEmpty />;
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {data?.items.map((item) => (
        <MarketItem key={item.id} market={item} />
      ))}
    </div>
  );
};
