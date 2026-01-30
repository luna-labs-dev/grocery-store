import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { NewMarketPage } from '@/features/market/features';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/app/market/new-market')({
  component: RouteComponent,
});

function RouteComponent() {
  const { addBreadcrumbs } = useBreadCrumbs();
  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Mercado',
          to: '/app/market',
        },
        {
          label: 'Novo Mercado',
          to: `/app/market/new-market`,
        },
      ],
      {
        title: 'Novo Mercado',
      },
    );
  }, []);
  return <NewMarketPage />;
}
