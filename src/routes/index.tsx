import { useAuth } from '@clerk/clerk-react';
import { protectedRoutes } from './protected-routes';
import { publicRoutes } from './public-routes';

export const useRoutes = () => {
  const { isLoaded, isSignedIn } = useAuth();

  const routes = isSignedIn ? protectedRoutes : publicRoutes;
  // const routes = publicRoutes;

  return { routes, isLoaded };
};
