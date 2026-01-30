import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { MarketPage } from '@/features/market/features';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/app/market/')({
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
      ],
      {
        title: 'Lista de Mercados',
      },
    );
  }, []);
  return <MarketPage />;
}
