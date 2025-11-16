import apiClient from '../../libs/axios';

//#region Mapping Functions


const mapMaterialFromApi = (item) => ({
  id: item.id,
  activityId: item.activityId, // This might be null for library materials
  learningMaterialId: item.learningMaterialId,
  name: item.name,
  description: item.description,
  type: item.learningMaterialType,
  url: item.materialUrl,
});

//#endregion

//#region Original Material CRUD Methods (Refactored to apiClient)

export const getMaterials = async ({ page = 1, pageSize = 1000 } = {}) => {
  try {
    const qs = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const response = await apiClient.get(`/Materials/paged${qs}`);
    const data = response.data || {};

    const rawItems = Array.isArray(data.items) ? data.items : [];
    const items = rawItems.map(mapMaterialFromApi);

    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || (pageSize > 0 ? Math.ceil(items.length / pageSize) : 1),
      raw: data,
    };
  } catch (error) {
    console.error('Error fetching paged materials:', error.response || error);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
};

export const createMaterial = async (payload) => {
  try {
    const response = await apiClient.post('/Materials', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating material:', error.response || error);
    throw error.response?.data || error;
  }
};

export const deleteMaterial = async (materialId) => {
  if (!materialId) {
    return Promise.reject(new Error('Material ID is required.'));
  }
  try {
    const response = await apiClient.delete(`/Materials/${materialId}`);
    return response.data; // Often 204 No Content, response.data will be undefined
  } catch (error) {
    console.error(`Error deleting material ${materialId}:`, error.response || error);
    throw error.response?.data || error;
  }
};

export const updateMaterial = async (materialId, payload) => {
  if (!materialId) {
    return Promise.reject(new Error('Material ID is required.'));
  }
  try {
    const response = await apiClient.put(`/Materials/${materialId}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating material ${materialId}:`, error.response || error);
    throw error.response?.data || error;
  }
};

//#endregion

//#region Activity-Material Methods

export const getMaterialsByActivityId = async (activityId) => {
  if (!activityId) {
    console.warn('getMaterialsByActivityId called without activityId');
    return [];
  }
  try {
    const response = await apiClient.get(`/Materials/activities/${activityId}/materials`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapMaterialFromApi);
  } catch (error) {
    console.error(`Error fetching materials for activity ${activityId}:`, error.response || error);
    return [];
  }
};

export const assignMaterialToActivity = async (activityId, materialId) => {
  if (!activityId || !materialId) {
    return Promise.reject(new Error('Activity ID and Material ID are required.'));
  }
  try {
    const response = await apiClient.post(`/Materials/activities/${activityId}/materials/${materialId}`);
    return response.data;
  } catch (error) {
    console.error(`Error assigning material ${materialId} to activity ${activityId}:`, error.response || error);
    throw error.response?.data || error;
  }
};

export const removeMaterialFromActivity = async (activityId, materialId) => {
  if (!activityId || !materialId) {
    return Promise.reject(new Error('Activity ID and Material ID are required.'));
  }
  try {
    const response = await apiClient.delete(`/Materials/activities/${activityId}/materials/${materialId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing material ${materialId} from activity ${activityId}:`, error.response || error);
    throw error.response?.data || error;
  }
};

//#endregion