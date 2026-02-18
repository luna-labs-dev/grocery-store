'use client';

import { ShoppingBasket } from 'lucide-react';
import { ShoppingEventItem } from './shopping-event-item';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  Skeleton,
  Spinner,
} from '@/components';
import type { FetchShoppingEventListParams } from '@/features/shopping-event/domain';
import { useGetShoppingEventListQuery } from '@/features/shopping-event/infrastructure';

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

function ShoppingEventListSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: is just a skeleton
        <Skeleton key={i} className="h-24 w-full rounded-xl" />
      ))}
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
  paginationParams: FetchShoppingEventListParams;
}
export function ShoppingEventList({ paginationParams }: Props) {
  const { data, isLoading, isError } =
    useGetShoppingEventListQuery(paginationParams);
  if (isLoading) {
    return <ShoppingEventListLoading />;
  }

  if (isError) {
    return <ShoppingEventListError />;
  }

  if (!data?.items?.length) {
    return <ShoppingEventListEmpty />;
  }

  const { items } = data;

  return (
    <div className="flex flex-col gap-3">
      {items?.map((se) => (
        <ShoppingEventItem key={se.id} shoppingEvent={se} />
      ))}
    </div>
  );
}

export {
  ShoppingEventListLoading,
  ShoppingEventListSkeleton,
  ShoppingEventListError,
  ShoppingEventListEmpty,
};
