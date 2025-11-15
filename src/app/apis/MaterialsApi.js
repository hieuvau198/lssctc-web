// src/app/apis/MaterialsApi.js
import { getAuthToken } from '../libs/cookies';

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL || import.meta.env.VITE_API_BASE_URL;

export async function createMaterial(payload, token) {
  const t = token || getAuthToken();
  const res = await fetch(`${API_BASE_URL}/Materials`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}
