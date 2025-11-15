// src/app/apis/Instructor/InstructorMaterialsApi.js
import { getAuthToken } from '../../libs/cookies';

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL || import.meta.env.VITE_API_BASE_URL;

export async function getMaterials({ page = 1, pageSize = 1000 } = {}, token) {
  const t = token || getAuthToken();
  const qs = new URLSearchParams({ page, pageSize }).toString();
  const res = await fetch(`${API_BASE_URL}/Materials/paged?${qs}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.json();
}

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

export async function deleteMaterial(materialId, token) {
  const t = token || getAuthToken();
  const res = await fetch(`${API_BASE_URL}/Materials/${materialId}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json',
      ...(t ? { Authorization: `Bearer ${t}` } : {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `HTTP ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

export async function updateMaterial(materialId, payload, token) {
  const t = token || getAuthToken();
  const res = await fetch(`${API_BASE_URL}/Materials/${materialId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'text/plain',
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
