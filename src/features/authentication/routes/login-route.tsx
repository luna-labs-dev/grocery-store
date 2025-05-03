import { RouteObject } from 'react-router-dom';
import { Login } from '../pages';

export const LoginRoutes: RouteObject[] = [
  {
    path: 'login',
    element: <Login />,
  },
];
