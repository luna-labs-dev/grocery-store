import { useAuth } from '@clerk/clerk-react';
import {
  createRouter,
  RouterProvider as TanstackRouterProvider,
} from '@tanstack/react-router';
import { routeTree } from '@/route-tree.gen';

const routerConfig = {
  routeTree,
  context: {
    auth: undefined,
  },
  defaultPreload: 'intent' as const,
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
};

// Create or retrieve the router instance
export const router =
  import.meta.hot?.data.router ?? createRouter(routerConfig);

// Keep the router instance in HMR data to persist across re-evaluations
if (import.meta.hot) {
  import.meta.hot.data.router = router;
  // Update the existing router with the newly imported routeTree
  router.update({ ...routerConfig, routeTree });
}

export const RouterProvider = () => {
  const auth = useAuth();

  return <TanstackRouterProvider router={router} context={{ auth }} />;
};
