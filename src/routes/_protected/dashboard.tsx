import { createFileRoute } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Page } from '@/components/layout/page-layout';
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
  return (
    <Page>
      <Page.Header className="p-4 border-b">
        <h1 className="text-lg font-semibold">Dashboard</h1>
      </Page.Header>
      <Page.Content className="p-4">
        <div>Dashboard Content will be placed here</div>
      </Page.Content>
      <Page.Footer>
        <div className="flex justify-center gap-2 p-4">
          <p>All rights reserved. {new Date().getFullYear()} Tiago</p>
        </div>
      </Page.Footer>
    </Page>
  );
}
