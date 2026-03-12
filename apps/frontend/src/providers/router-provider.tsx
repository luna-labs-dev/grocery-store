import {
  createRouter,
  RouterProvider as TanstackRouterProvider,
} from '@tanstack/react-router';
import { useSession } from '@/infrastructure/auth/auth-client';
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
    const hot = import.meta.hot;

    if (hot.data?.router) {
      const existing = hot.data.router as typeof newRouter;
      existing.update({ ...routerConfig, routeTree });
      return existing;
    }
    if (hot.data) {
      hot.data.router = newRouter;
    }
  }
  return newRouter;
}

export const router = getRouter();

export const RouterProvider = () => {
  const session = useSession();

  if (session.isPending) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />
          <p className="text-sm font-medium text-muted-foreground">
            Carregando sessão...
          </p>
        </div>
      </div>
    );
  }

  return <TanstackRouterProvider router={router} context={{ auth: session }} />;
};
