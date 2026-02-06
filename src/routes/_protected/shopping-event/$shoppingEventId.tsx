import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ShoppingEventDetailsPage } from '@/features/shopping-event/features';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute(
  '/_protected/shopping-event/$shoppingEventId',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { shoppingEventId } = Route.useParams();

  const { addBreadcrumbs } = useBreadCrumbs();
  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Evento de compra',
          to: '/shopping-event',
        },
        {
          label: 'Detalhes do evento',
          to: '/shopping-event/$shoppingEventId',
        },
      ],
      {
        title: 'Detalhes do Evento de compra',
      },
    );
  }, []);

  return <ShoppingEventDetailsPage shoppingEventId={shoppingEventId} />;
}
