import Cookies from 'js-cookie';

export const TOKEN_COOKIE_KEY = 'token';

export function setAuthToken(token, opts = {}) {
  const defaultOpts = { path: '/' };
  // In production prefer secure cookies unless explicitly overridden
  if (import.meta.env && import.meta.env.PROD) {
    defaultOpts.secure = true;
  }
  Cookies.set(TOKEN_COOKIE_KEY, token, { ...defaultOpts, ...opts });
}

export function getAuthToken() {
  return Cookies.get(TOKEN_COOKIE_KEY) || null;
}

export function removeAuthToken(opts = {}) {
  Cookies.remove(TOKEN_COOKIE_KEY, { path: '/', ...opts });
}

// Generic helpers (optional) -------------------------------------------------
export function setCookie(key, value, opts = {}) {
  const defaultOpts = { path: '/' };
  if (import.meta.env && import.meta.env.PROD) defaultOpts.secure = true;
  Cookies.set(key, value, { ...defaultOpts, ...opts });
}

export function getCookie(key) {
  return Cookies.get(key) || null;
}

export function removeCookie(key, opts = {}) {
  Cookies.remove(key, { path: '/', ...opts });
}

export default {
  TOKEN_COOKIE_KEY,
  setAuthToken,
  getAuthToken,
  removeAuthToken,
  setCookie,
  getCookie,
  removeCookie,
};
