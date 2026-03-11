import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import type { useSession } from '@/infrastructure/auth/auth-client';

export interface RootRouteContext {
  auth?: ReturnType<typeof useSession>;
}
const RootLayout = () => {
  return (
    <>
      <HeadContent />
      <Outlet />
      {import.meta.env.VITE_DEV_TOOLS === 'true' ? (
        <>
          <TanStackRouterDevtools position="bottom-left" />
          <ReactQueryDevtools position="left" buttonPosition="bottom-left" />
        </>
      ) : null}
    </>
  );
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: RootLayout,
});
