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
          label: 'Evento de compras',
          to: '/shopping-event',
        },
        {
          label: 'Iniciar evento de compras',
          to: `/shopping-event/$shoppingEventId`,
        },
      ],
      {
        title: 'Iniciar evento de compras',
      },
    );
  }, []);
  return <StartShoppingEvent />;
}
