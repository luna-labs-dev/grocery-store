import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NewMarketPage } from '@/features/market/features';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/market/new-market')({
  component: RouteComponent,
});

function RouteComponent() {
  const { addBreadcrumbs } = useBreadCrumbs();
  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Mercado',
          to: '/market',
        },
        {
          label: 'Novo Mercado',
          to: '/market/new-market',
        },
      ],
      {
        title: 'Novo Mercado',
      },
    );
  }, []);
  return <NewMarketPage />;
}
