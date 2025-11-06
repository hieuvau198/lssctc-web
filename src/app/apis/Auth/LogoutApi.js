import apiClient from '../../libs/axios';
import { removeAuthToken } from '../../libs/cookies';
import useAuthStore from '../../store/authStore';

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
      removeAuthToken();
    } catch (e) {}
    try {
      const store = useAuthStore.getState();
      if (store && typeof store.clearAuth === 'function') store.clearAuth();
    } catch (e) {}
  }
  return true;
}

export default {
  logout,
};