import { signify } from 'react-signify';

// Khởi tạo từ localStorage để không mất sau reload
const initial = typeof window !== 'undefined' ? (localStorage.getItem('app_avatar') || '') : '';
export const sAvatarUrl = signify(initial);

export function setAvatarUrl(url) {
  sAvatarUrl.set(url || '');
  try { localStorage.setItem('app_avatar', url || ''); } catch {}
}

export function clearAvatarUrl() {
  try { localStorage.removeItem('app_avatar'); } catch {}
  sAvatarUrl.set('');
}
