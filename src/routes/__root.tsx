import type { useAuth } from '@clerk/clerk-react';
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
      <TanStackRouterDevtools position="top-right" />
    </>
  );
};

export const Route = createRootRouteWithContext<RootRouteContext>()({
  component: RootLayout,
});
