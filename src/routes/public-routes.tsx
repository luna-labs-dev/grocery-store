import { AppRedirectionHandler } from '@/components';
import { LandingPage } from '@/features/landing-page';
import { PublicApp } from '@/pages';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/app',
    element: <PublicApp />,
  },

  {
    path: '*',
    element: <AppRedirectionHandler redirectTo="/app/login" />,
  },
];
