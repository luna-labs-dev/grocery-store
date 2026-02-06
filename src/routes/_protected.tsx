import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';
import { MainLayout } from '@/components';

export const Route = createFileRoute('/_protected')({
  beforeLoad: async ({ context }) => {
    const token = await context.auth?.getToken();

    if (!token) {
      throw redirect({
        to: '/signin',
      });
    }
  },

  component: RouteComponent,
});

function RouteComponent() {
  console.log('layout');
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}
