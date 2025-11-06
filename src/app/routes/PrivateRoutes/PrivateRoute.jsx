import { Navigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { isTokenExpired } from '../../utils/jwtUtil';
import { getAuthToken } from '../../libs/cookies';

export default function PrivateRoute({ children, redirectUrl = '/auth/login', allowedroles = [] }) {
  const auth = useAuthStore((state) => state);

  // Prefer explicit cookie token check (covers page reloads where zustand may not be hydrated yet)
  const cookieToken = getAuthToken();
  const tokenToCheck = cookieToken || auth?.token;

  // If there is no token at all, redirect to login
  if (!tokenToCheck) return <Navigate to={redirectUrl} replace />;

  const isAuthenticated = !!tokenToCheck;
  const tokenExpired = isTokenExpired(tokenToCheck);

  const role = auth?.role || '';
  const roleAllowed = Array.isArray(allowedroles) && allowedroles.length > 0
    ? allowedroles.map((r) => String(r).toLowerCase()).includes(String(role).toLowerCase())
    : true; // if no allowedroles specified, allow any authenticated user
  // Helper: default landing page per role
  const defaultRouteForRole = (r) => {
    if (!r) return '/';
    switch (String(r).toLowerCase()) {
      case 'admin':
        return '/admin/dashboard';
      case 'instructor':
        return '/instructor/dashboard';
      case 'trainee':
        return '/';
      case 'simulationmanager':
      case 'simulation-manager':
        return '/simulation-manager/dashboard';
      case 'programmanager':
      case 'program-manager':
        return '/program-manager/dashboard';
      default:
        return '/';
    }
  };

  if (isAuthenticated && !tokenExpired && roleAllowed) {
    return <>{children}</>;
  }

  // If authenticated but not allowed by role, redirect to role's default page
  if (isAuthenticated && !tokenExpired && !roleAllowed) {
    const dest = defaultRouteForRole(role) || redirectUrl;
    return <Navigate to={dest} replace />;
  }

  // Not authenticated or token expired -> redirect to login
  return <Navigate to={redirectUrl} replace />;
}
