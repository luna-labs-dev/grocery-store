import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { FamilyOnboardingPage } from '@/features/family/pages';
import { useBreadCrumbs } from '@/hooks';

export const Route = createFileRoute('/_protected/app/family/')({
  component: RouteComponent,
});

function RouteComponent() {
  const { addBreadcrumbs } = useBreadCrumbs();
  useEffect(() => {
    addBreadcrumbs(
      [
        {
          label: 'Família',
          to: '/app/family',
        },
      ],
      {
        title: 'Familia',
      },
    );
  }, []);

  return <FamilyOnboardingPage />;
}
