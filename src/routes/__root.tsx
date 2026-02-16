import type { useAuth } from '@clerk/clerk-react';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

interface RootRouteContext {
  auth?: ReturnType<typeof useAuth>;
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
