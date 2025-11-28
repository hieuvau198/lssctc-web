// src/app/apis/SimulationManager/SimulationManagerComponentApi.js
import apiClient from '../../libs/axios';

// Cho phép truyền token nếu cần override hoặc dùng token khác
function withAuth(headers = {}, token) {
  if (token) return { ...headers, Authorization: `Bearer ${token}` };
  return headers;
}

export async function getComponents(page = 1, pageSize = 10, token) {
  const qs = new URLSearchParams({ page, pageSize }).toString();
  const res = await apiClient.get(`/Components?${qs}`, { headers: withAuth({}, token) });
  return res.data;
}

export async function getComponentById(id, token) {
  const res = await apiClient.get(`/Components/${id}`, { headers: withAuth({}, token) });
  return res.data;
}

export async function updateComponent(id, data, token) {
  const res = await apiClient.put(`/Components/${id}`, data, { headers: withAuth({}, token) });
  return res.data;
}
