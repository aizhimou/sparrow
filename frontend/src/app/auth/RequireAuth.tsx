import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from './useAuth';

export function RequireAuth() {
  const auth = useAuth();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
