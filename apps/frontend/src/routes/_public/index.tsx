import { createFileRoute, redirect } from '@tanstack/react-router';
import { LandingPage } from '@/features/landing-page';

export const Route = createFileRoute('/_public/')({
  component: Index,
  beforeLoad: async () => {
    throw redirect({
      to: '/signin',
    });
  },
  head: () => ({
    meta: [
      {
        title: 'Grocery Store',
      },
    ],
  }),
});

function Index() {
  return <LandingPage />;
}
