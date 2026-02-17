import { createFileRoute, redirect } from '@tanstack/react-router';
import { SigninPage } from '@/features/auth/pages/signin';

export const Route = createFileRoute('/_public/signin')({
  beforeLoad: async ({ context }) => {
    const token = await context.auth?.getToken();
    if (token) {
      throw redirect({
        to: '/dashboard',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <SigninPage />;
}
