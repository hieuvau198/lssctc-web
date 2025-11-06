import { jwtDecode } from 'jwt-decode';
import useAuthStore from '../store/authStore';

/**
 * Decode a JWT token safely.
 * @param {string} token
 * @returns {object|null} decoded payload or null on failure
 */
export function decodeToken(token) {
  if (!token || typeof token !== 'string') return null;
  try {
    const claims = jwtDecode(token);
    return claims || null;
  } catch (err) {
    return null;
  }
}

/**
 * Decode the token and store into the auth store.
 * This will call the store's `setToken` which also persists the token to cookie
 * and writes the claims into the store state.
 *
 * @param {string} token
 * @returns {object|null} decoded claims
 */
export function decodeAndStore(token) {
  if (!token) return null;
  const claims = decodeToken(token);
  try {
    const store = useAuthStore.getState();
    if (store && typeof store.setToken === 'function') {
      store.setToken(token);
    }
  } catch (err) {
    // swallow
  }
  return claims;
}

export default {
  decodeToken,
  decodeAndStore,
};
