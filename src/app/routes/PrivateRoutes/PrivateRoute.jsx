import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import { isTokenExpired } from '../../utils/jwtUtil';
import { getAuthToken } from '../../libs/cookies';
import { jwtDecode } from 'jwt-decode';

export default function PrivateRoute({ children, redirectUrl = '/auth/login', allowedroles = [] }) {
  const auth = useAuthStore((state) => state);
  const [isHydrated, setIsHydrated] = useState(false);

  // Wait for authStore to hydrate from cookies
  useEffect(() => {
    // Small delay to ensure zustand persist middleware has loaded
    const timer = setTimeout(() => setIsHydrated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Prefer explicit cookie token check (covers page reloads where zustand may not be hydrated yet)
  const cookieToken = getAuthToken();
  const tokenToCheck = cookieToken || auth?.token;

  // If there is no token at all, redirect to login
  if (!tokenToCheck) return <Navigate to={redirectUrl} replace />;

  const isAuthenticated = !!tokenToCheck;
  const tokenExpired = isTokenExpired(tokenToCheck);

  // Get role from token directly if authStore hasn't hydrated yet
  let role = auth?.role || '';
  if (!role && cookieToken) {
    try {
      const decoded = jwtDecode(cookieToken);
      role = decoded?.role || '';
    } catch (e) {
      // ignore decode error
    }
  }

  // If authStore not hydrated yet and we have a valid token, show loading or wait
  if (!isHydrated && cookieToken && !auth?.role) {
    return null; // or a loading spinner component
  }
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
