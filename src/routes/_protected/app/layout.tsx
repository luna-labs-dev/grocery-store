import { createFileRoute, Outlet } from '@tanstack/react-router';
import { MainLayout } from '@/components/';

export const Route = createFileRoute('/_protected/app')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
