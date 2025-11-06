import { jwtDecode } from 'jwt-decode';
import { getAuthToken } from '../libs/cookies';

/**
 * Check whether the current auth token is expired.
 * If a token is present, decode and check the `exp` claim.
 * Returns true when token is missing or expired.
 */
export function isTokenExpired(token) {
  try {
    const t = token || getAuthToken();
    if (!t) return true;
    const claims = jwtDecode(t) || {};
    // exp is seconds since epoch in JWT
    if (!claims.exp) return false; // no exp claim -> assume non-expiring
    const now = Math.floor(Date.now() / 1000);
    return claims.exp <= now;
  } catch (err) {
    // If decoding fails, treat as expired/invalid
    return true;
  }
}

export default {
  isTokenExpired,
};
