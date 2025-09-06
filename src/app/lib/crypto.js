import CryptoJS from 'crypto-js';

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
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    const cipher = CryptoJS.AES.encrypt(JSON.stringify({ email, password }), KEY).toString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cipher, ts: Date.now() }));
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
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.cipher || !parsed?.ts) return null;
    if (Date.now() - parsed.ts > MAX_AGE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    const bytes = CryptoJS.AES.decrypt(parsed.cipher, KEY);
    const decrypted = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return {
      email: decrypted.email || '',
      password: decrypted.password || '',
    };
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

/**
 * Clear stored remembered credentials.
 */
export function clearRememberedCredentials() {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
}

export const rememberConstants = { STORAGE_KEY, MAX_AGE_MS };
