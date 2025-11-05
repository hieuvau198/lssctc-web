import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

const KEY = import.meta.env.VITE_CRYPTO_KEY;

const STORAGE_KEY = 'lssctc.auth.remember';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Encrypt and persist credentials (email + password) to localStorage.
 * If remember is false, existing persisted credentials are cleared.
 * Safe no-throw operations.
 */
export function persistRememberedCredentials({ email, password, remember }) {
  try {
    if (!remember) {
      Cookies.remove(STORAGE_KEY, { path: '/' });
      return;
    }
    const cipher = CryptoJS.AES.encrypt(JSON.stringify({ email, password }), KEY).toString();
    const payload = JSON.stringify({ cipher, ts: Date.now() });
    Cookies.set(STORAGE_KEY, payload, {
      expires: MAX_AGE_MS / (24 * 60 * 60 * 1000), // days
      sameSite: 'lax',
      secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : true,
      path: '/',
    });
  } catch {
    // swallow
  }
}

/**
 * Read and decrypt remembered credentials. Returns
 * { email, password } or null if none/invalid/expired.
 */
export function loadRememberedCredentials() {
  try {
    const raw = Cookies.get(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.cipher || !parsed?.ts) return null;
    if (Date.now() - parsed.ts > MAX_AGE_MS) {
      Cookies.remove(STORAGE_KEY, { path: '/' });
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(parsed.cipher, KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return {
      email: decrypted.email || '',
      password: decrypted.password || '',
    };
  } catch {
    Cookies.remove(STORAGE_KEY, { path: '/' });
    return null;
  }
}

/**
 * Clear stored remembered credentials.
 */
export function clearRememberedCredentials() {
  try { Cookies.remove(STORAGE_KEY, { path: '/' }); } catch { /* ignore */ }
}

export const rememberConstants = { STORAGE_KEY, MAX_AGE_MS };
