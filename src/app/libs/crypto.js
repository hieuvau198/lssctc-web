import CryptoJS from 'crypto-js';
import Cookies from 'js-cookie';

// Use configured crypto key; fall back to a deterministic dev key if not provided so
// the remember-me feature still works during local development.
const KEY = import.meta.env.VITE_CRYPTO_KEY || 'lssctc-dev-fallback-key-2024';

const STORAGE_KEY = 'lssctc.auth.remember';
const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

/**
 * Encrypt and persist credentials (email + password) to cookies.
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
      secure: typeof window !== 'undefined' ? window.location.protocol === 'https:' : false,
      path: '/',
    });
    console.log('Credentials saved to cookie:', STORAGE_KEY);
  } catch (err) {
    console.error('Failed to save remembered credentials:', err);
    // If encryption or cookie write fails, remove any stale value to avoid confusion.
    try { Cookies.remove(STORAGE_KEY, { path: '/' }); } catch {}
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
    if (!parsed?.cipher || !parsed?.ts) {
      console.log('Invalid remembered credentials format');
      Cookies.remove(STORAGE_KEY, { path: '/' });
      return null;
    }
    
    if (Date.now() - parsed.ts > MAX_AGE_MS) {
      Cookies.remove(STORAGE_KEY, { path: '/' });
      return null;
    }
    
    const bytes = CryptoJS.AES.decrypt(parsed.cipher, KEY);
    const plain = bytes.toString(CryptoJS.enc.Utf8);
    if (!plain) {
      // decryption failed (likely wrong key) — remove cookie
      Cookies.remove(STORAGE_KEY, { path: '/' });
      return null;
    }
    
    const decrypted = JSON.parse(plain);
    return {
      email: decrypted.email || '',
      password: decrypted.password || '',
    };
  } catch (err) {
    console.error('Error loading remembered credentials:', err);
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
