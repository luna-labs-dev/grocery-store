import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/app/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { addBreadcrumbs } = useBreadCrumbs();
  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Dashboard',
          to: '/app',
        },
      ],
      {
        title: 'Dashboard',
        subTitle: 'Dashboard do projeto',
      },
    );
  }, []);
  return <div>Hello "/_authenticated/dashboard"!</div>;
}
