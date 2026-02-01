import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/dashboard')({
  component: RouteComponent,
});

function RouteComponent() {
  const { addBreadcrumbs } = useBreadCrumbs();

  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Dashboard',
          to: '/dashboard',
        },
      ],
      {
        title: 'Dashboard',
        subTitle: 'This will be the Dashboard once we implement it.',
      },
    );
  }, []);
  return <div>Dashboard Content will be placed here</div>;
}
