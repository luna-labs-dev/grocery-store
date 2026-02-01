import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { ShoppingEventPage } from '@/features/shopping-event/features';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/shopping-event/')({
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
      ],
      {
        title: 'Evento de compra',
      },
    );
  }, []);
  return <ShoppingEventPage />;
}
