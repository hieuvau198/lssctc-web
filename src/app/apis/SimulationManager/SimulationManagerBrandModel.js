// src/app/apis/SimulationManager/SimulationManagerBrandModel.js
import apiClient from '../../libs/axios';

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

const mapBrandModelFromApi = (item) => ({
  id: item.id || item.brandModelId || null,
  name: item.name || item.title || item.brandName || '',
  description: item.description || item.desc || '',
  isActive: Boolean(item.isActive ?? item.active ?? true),
  createdAt: item.createdAt || item.created_at || null,
  updatedAt: item.updatedAt || item.updated_at || null,
  raw: item,
});

export async function getBrandModels(params = {}) {
  try {
    const qs = buildQuery(params);
    const { data } = await apiClient.get(`/BrandModels${qs}`);
    if (!data) return { items: [], total: 0 };

    const items = Array.isArray(data)
      ? data.map(mapBrandModelFromApi)
      : (Array.isArray(data.items) ? data.items.map(mapBrandModelFromApi) : []);
    const total = data.total || data.totalCount || items.length;
    return { items, total: Number(total) || items.length, raw: data };
  } catch (err) {
    console.error('Error fetching BrandModels:', err);
    throw err;
  }
}

export async function createBrandModel(payload = {}) {
  try {
    const { data } = await apiClient.post(`/BrandModels`, payload);
    if (!data) throw new Error('Failed to create BrandModel');
    return mapBrandModelFromApi(data);
  } catch (err) {
    console.error('Error creating BrandModel:', err);
    throw err;
  }
}

export async function getBrandModelById(id) {
  try {
    const { data } = await apiClient.get(`/BrandModels/${id}`);
    if (!data) throw new Error('BrandModel not found');
    return mapBrandModelFromApi(data);
  } catch (err) {
    console.error('Error fetching BrandModel by id:', err);
    throw err;
  }
}

export async function updateBrandModel(id, payload = {}) {
  try {
    const { data } = await apiClient.put(`/BrandModels/${id}`, payload);
    if (!data) throw new Error('Failed to update BrandModel');
    return mapBrandModelFromApi(data);
  } catch (err) {
    console.error('Error updating BrandModel:', err);
    throw err;
  }
}

export async function deleteBrandModel(id) {
  try {
    const { data } = await apiClient.delete(`/BrandModels/${id}`);
    return data;
  } catch (err) {
    console.error('Error deleting BrandModel:', err);
    throw err;
  }
}

export default {
  getBrandModels,
  createBrandModel,
  getBrandModelById,
  updateBrandModel,
  deleteBrandModel,
};
