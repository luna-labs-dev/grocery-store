import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { UpdateMarketPage } from '@/features/market/features';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/app/market/update/$marketId')(
  {
    component: RouteComponent,
  },
);

function RouteComponent() {
  const { marketId } = Route.useParams();
  const { addBreadcrumbs } = useBreadCrumbs();
  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Mercado',
          to: '/app/market',
        },
        {
          label: 'Editar Mercado',
          to: `/app/market/update/$marketId`,
        },
      ],
      {
        title: 'Editar Mercado',
      },
    );
  }, []);

  return <UpdateMarketPage marketId={marketId} />;
}
