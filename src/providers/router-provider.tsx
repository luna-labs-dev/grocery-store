import { RouterProvider as Router, createBrowserRouter } from 'react-router-dom';

import { LoadingCart } from '@/components/shared/loading-cart';
import { history } from '@/domain/utils/history';
import { useRoutes } from '@/routes';

export const RouterProvider = () => {
  const { routes, isLoaded } = useRoutes();

  const router = createBrowserRouter(routes);
  history.navigate = router.navigate;

  const test = false;
  if (!isLoaded || test) {
    return (
      <div className="flex items-center justify-center w-screen h-screen">
        <LoadingCart className="w-[300px] h-[150px]" size={60} />
      </div>
    );
  }
  return <Router router={router} />;
};
