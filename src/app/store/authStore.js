// src\app\store\authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setAuthToken, removeAuthToken, getCookie, setCookie, removeCookie } from '../libs/cookies';
import { jwtDecode } from 'jwt-decode';

const COOKIE_STORAGE_KEY = 'auth_store';

// Custom storage for zustand persist to use cookies instead of localStorage
const cookieStorage = {
  getItem: (name) => {
    try {
      const v = getCookie(name);
      return v;
    } catch (err) {
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      // store string value in cookie for 7 days
      setCookie(name, value, { expires: 7 });
    } catch (err) {
      // ignore
    }
  },
  removeItem: (name) => {
    try {
      removeCookie(name);
    } catch (err) {}
  },
};

const initialState = {
  token: null,
  name: null,
  jti: null,
  nameid: null,
  role: null,
  nbf: null,
  exp: null,
  iat: null,
  iss: null,
  aud: null,
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      setFromClaims: (claims = {}) => {
        set({
          name: claims.name || claims.sub || null,
          jti: claims.jti || null,
          nameid: claims.nameid || claims.nameId || null,
          role: claims.role || null,
          nbf: claims.nbf || null,
          exp: claims.exp || null,
          iat: claims.iat || null,
          iss: claims.iss || null,
          aud: claims.aud || null,
        });
      },

      setToken: (token, options = {}) => {
        if (!token) return;
        
        // persist cookie for authentication header
        try {
          // Use options for cookie expiration (e.g., remember me)
          setAuthToken(token, options);
        } catch (err) {}
        
        // decode and store claims
        try {
          const claims = jwtDecode(token) || {};
          set({ token });
          get().setFromClaims(claims);
        } catch (err) {
          // fallback: just set token
          set({ token });
        }
      },

      clearAuth: () => {
        try {
          removeAuthToken();
        } catch (err) {}
        set({ ...initialState });
      },
    }),
    {
      name: COOKIE_STORAGE_KEY,
      storage: cookieStorage,
      // serialize/deserialize handled by cookieStorage as strings
    }
  )
);

export default useAuthStore;
export { initialState, COOKIE_STORAGE_KEY };