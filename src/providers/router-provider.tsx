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

function getRouter() {
  const newRouter = createRouter(routerConfig);

  if (typeof window !== 'undefined' && import.meta.hot) {
    const hotData = import.meta.hot.data;
    if (hotData.router) {
      const existing = hotData.router as typeof newRouter;
      existing.update({ ...routerConfig, routeTree });
      return existing;
    }
    hotData.router = newRouter;
  }
  return newRouter;
}

export const router = getRouter();

export const RouterProvider = () => {
  const auth = useAuth();

  return <TanstackRouterProvider router={router} context={{ auth }} />;
};
