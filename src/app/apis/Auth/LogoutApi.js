import apiClient from '../../libs/axios';
import { removeAuthToken, removeCookie } from '../../libs/cookies';
import useAuthStore, { COOKIE_STORAGE_KEY } from '../../store/authStore';

/**
 * Call backend logout endpoint and clear client-side auth state.
 * The apiClient automatically attaches the Authorization header from cookies.
 */
export async function logout() {
  try {
    await apiClient.post('/Authens/logout');
  } catch (err) {
  } finally {
    try {
      // remove the auth token cookie
      removeAuthToken();
    } catch (e) {}
    try {
      // remove the persisted auth store cookie (but DO NOT touch the remember-me cookie)
      try { removeCookie(COOKIE_STORAGE_KEY); } catch (e) {}

      const store = useAuthStore.getState();
      if (store && typeof store.clearAuth === 'function') store.clearAuth();
    } catch (e) {}
  }
  return true;
}

export default {
  logout,
};