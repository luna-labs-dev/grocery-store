import { createFileRoute } from '@tanstack/react-router';
import { LandingPage } from '@/features/landing-page';

export const Route = createFileRoute('/_public/')({
  component: Index,
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
