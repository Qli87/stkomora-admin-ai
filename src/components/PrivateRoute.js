/**
 * Protects routes: redirects to login if not authenticated.
 * Uses localStorage token for simplicity; can be switched to Redux selectIsAuthenticated.
 */
import { Navigate, useLocation } from 'react-router-dom';
import { routes } from '../core/constants/routes';

export function PrivateRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to={routes.login} state={{ from: location }} replace />;
  }

  return children;
}
