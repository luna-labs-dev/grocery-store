import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { StartShoppingEvent } from '@/features/shopping-event/features/shopping-event-list/components/start-shopping-event';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute(
  '/_protected/shopping-event/start-shopping-event',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { addBreadcrumbs } = useBreadCrumbs();
  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Evento de compra',
          to: '/shopping-event',
        },
        {
          label: 'Iniciar evento de compra',
          to: `/shopping-event/$shoppingEventId`,
        },
      ],
      {
        title: 'Iniciar evento de compra',
      },
    );
  }, []);
  return <StartShoppingEvent />;
}
