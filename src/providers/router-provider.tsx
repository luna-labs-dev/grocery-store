import { useAuth } from '@clerk/clerk-react';
import {
  createRouter,
  RouterProvider as TanstackRouterProvider,
} from '@tanstack/react-router';
import { routeTree } from '@/route-tree.gen';

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

export const RouterProvider = () => {
  const auth = useAuth();

  return <TanstackRouterProvider router={router} context={{ auth }} />;
};
