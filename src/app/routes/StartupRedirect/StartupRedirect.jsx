import { jwtDecode } from "jwt-decode";
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getAuthToken } from "../../libs/cookies";
import { isTokenExpired } from "../../utils/jwtUtil";

export default function StartupRedirect() {
  const nav = useNavigate();
  const loc = useLocation();

  // default mapping per role (keeps consistent with PrivateRoute)
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
        return '/simulationManager/dashboard';
      default:
        return '/';
    }
  };

  // Run once on mount: if token present and valid, and user is on root/home, redirect to role default
  useEffectOnce(() => {
    try {
      const token = getAuthToken();
      if (!token) return;
      if (isTokenExpired(token)) return;
      let role = null;
      try {
        const decoded = jwtDecode(token);
        role = decoded?.role || null;
      } catch (e) {
        // ignore
      }

      // Only redirect from top-level home paths to avoid interrupting deep links
      const isRootLike = ["/", "", "/home"].includes(loc.pathname);
      if (isRootLike) {
        const dest = defaultRouteForRole(role);
        if (dest && dest !== loc.pathname) {
          nav(dest, { replace: true });
        }
      }
    } catch (err) {
      // swallow
    }
  });

  return null;
}

// tiny helper to run an effect only once without eslint noise
function useEffectOnce(fn) {
  useEffect(() => {
    fn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}