// src\app\store\authStore.js
import { signify } from 'react-signify';
import { setAuthToken, removeAuthToken, getCookie, setCookie } from '../libs/cookies';
import { jwtDecode } from 'jwt-decode';

const COOKIE_STORAGE_KEY = 'auth_store';

const initialState = {
  token: null,
  name: null,
  fullName: null,
  avatarUrl: null,
  jti: null,
  nameid: null,
  role: null,
  nbf: null,
  exp: null,
  iat: null,
  iss: null,
  aud: null,
};

// Load từ cookie nếu có
const loadFromCookie = () => {
  try {
    const stored = getCookie(COOKIE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...initialState, ...parsed };
    }
  } catch {}
  return { ...initialState };
};

// Persist vào cookie
const persistToCookie = (state) => {
  try {
    setCookie(COOKIE_STORAGE_KEY, JSON.stringify(state), { expires: 7 });
  } catch {}
};

// Signify store
export const sAuthStore = signify(loadFromCookie());

// Hook-like accessor để tương thích với code cũ
const useAuthStore = () => {
  const state = sAuthStore.use();
  // Trả về cả state và các method để các component có thể destructure như Zustand
  return {
    ...state,
    setToken: useAuthStore.setToken,
    setFromClaims: useAuthStore.setFromClaims,
    clearAuth: useAuthStore.clearAuth,
  };
};

// Getter không hook
useAuthStore.getState = () => sAuthStore.value;

// setFromClaims
useAuthStore.setFromClaims = (claims = {}) => {
  const current = sAuthStore.value;
  const updated = {
    ...current,
    name: claims.name || claims.sub || current.name,
    fullName: claims.FullName || claims.fullName || claims.full_name || claims.name || current.fullName,
    avatarUrl: claims.AvatarUrl || claims.avatarUrl || claims.picture || claims.avatar || current.avatarUrl,
    jti: claims.jti || current.jti,
    nameid: claims.nameid || claims.nameId || current.nameid,
    role: claims.role || current.role,
    nbf: claims.nbf || current.nbf,
    exp: claims.exp || current.exp,
    iat: claims.iat || current.iat,
    iss: claims.iss || current.iss,
    aud: claims.aud || current.aud,
  };
  sAuthStore.set(updated);
  persistToCookie(updated);
};

// setToken
useAuthStore.setToken = (token, options = {}) => {
  if (!token) return;
  
  // Persist cookie cho authentication header
  try {
    setAuthToken(token, options);
  } catch {}
  
  // Decode và lưu claims
  try {
    const claims = jwtDecode(token) || {};
    const current = sAuthStore.value;
    const updated = { ...current, token };
    sAuthStore.set(updated);
    persistToCookie(updated);
    useAuthStore.setFromClaims(claims);
  } catch {
    // Fallback: chỉ set token
    const current = sAuthStore.value;
    const updated = { ...current, token };
    sAuthStore.set(updated);
    persistToCookie(updated);
  }
};

// clearAuth
useAuthStore.clearAuth = () => {
  try {
    removeAuthToken();
  } catch {}
  sAuthStore.set({ ...initialState });
  persistToCookie(initialState);
};

// Ensure methods are attached to the raw value so callers using useAuthStore.getState()
// can still call setToken / setFromClaims / clearAuth directly.
const attachMethods = () => {
  try {
    const v = sAuthStore.value || {};
    v.setToken = useAuthStore.setToken;
    v.setFromClaims = useAuthStore.setFromClaims;
    v.clearAuth = useAuthStore.clearAuth;
    // apply back if necessary
    // Note: signify's internal value is a reference, so mutating v suffices.
  } catch {}
};

// attach now and after any set
attachMethods();
const _origSet = sAuthStore.set;
sAuthStore.set = (next) => {
  _origSet(next);
  attachMethods();
};

export default useAuthStore;
export { initialState, COOKIE_STORAGE_KEY };