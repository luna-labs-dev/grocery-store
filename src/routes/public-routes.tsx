import { AppRedirectionHandler } from '@/components';
import { LoginRoutes } from '@/features/authentication';
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
    children: [
      ...LoginRoutes,
      {
        path: '/app',
        element: <AppRedirectionHandler redirectTo="login" />,
      },
    ],
  },

  {
    path: '*',
    element: <AppRedirectionHandler redirectTo="/app/login" />,
  },
];
