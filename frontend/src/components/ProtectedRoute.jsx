import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some(role => user.roles.includes(role))) {
    // Role not authorized, redirect to their appropriate dashboard or home
    if (user.roles.includes('ROLE_ADMIN')) return <Navigate to="/admin" replace />;
    if (user.roles.includes('ROLE_DOCTOR')) return <Navigate to="/doctor" replace />;
    if (user.roles.includes('ROLE_PATIENT')) return <Navigate to="/patient" replace />;
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
