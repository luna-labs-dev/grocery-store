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
          label: 'Eventos de compra',
          to: '/shopping-event',
        },
        {
          label: 'Detalhes do evento de compra',
          to: `/shopping-event/$shoppingEventId`,
        },
      ],
      {
        title: 'Detalhes do evento de compra',
        subTitle: 'Detalhes do evento de compra',
      },
    );
  }, []);
  return <ShoppingEventDetailsPage shoppingEventId={shoppingEventId} />;
}
