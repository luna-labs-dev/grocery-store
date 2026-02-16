import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { UpdateMarketPage } from '@/features/market/features';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/market/update/$marketId')({
  component: RouteComponent,
});

function RouteComponent() {
  const { marketId } = Route.useParams();
  const { addBreadcrumbs } = useBreadCrumbs();
  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Mercado',
          to: '/market',
        },
        {
          label: 'Editar Mercado',
          to: '/market/update/$marketId',
        },
      ],
      {
        title: 'Editar Mercado',
      },
    );
  }, []);

  return <UpdateMarketPage marketId={marketId} />;
}
