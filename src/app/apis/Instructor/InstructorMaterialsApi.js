// hieuvau198/lssctc-web/lssctc-web-dev/src/app/apis/Instructor/InstructorMaterialsApi.js

import apiClient from '../../libs/axios';

//#region Mapping Functions

const mapMaterialFromApi = (item) => ({
  id: item.id,
  activityId: item.activityId, // This might be null for library materials
  learningMaterialId: item.learningMaterialId,
  name: item.name,
  description: item.description,
  learningMaterialType: item.learningMaterialType, // Updated to use string type
  url: item.materialUrl,
});

//#endregion

//#region Original Material CRUD Methods (Refactored to apiClient)

export const getMaterials = async ({ page = 1, pageSize = 1000 } = {}) => {
  try {
    const response = await apiClient.get(`/Materials`);
    const rawItems = Array.isArray(response.data) ? response.data : [];

    const startIdx = (page - 1) * pageSize;
    const paginatedItems = rawItems.slice(startIdx, startIdx + pageSize);
    const items = paginatedItems.map(mapMaterialFromApi);

    return {
      items,
      totalCount: rawItems.length,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(rawItems.length / pageSize),
    };
  } catch (error) {
    console.error('Error fetching materials:', error.response || error);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
};

// NEW: Server-side pagination support
export const getMaterialsPaged = async ({ page = 1, pageSize = 10, searchTerm = '' } = {}) => {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('PageNumber', page);
    searchParams.append('PageSize', pageSize);
    if (searchTerm) searchParams.append('SearchTerm', searchTerm);

    const response = await apiClient.get(`/Materials/paged?${searchParams.toString()}`);
    const data = response.data;

    return {
      items: (data.items || []).map(mapMaterialFromApi),
      totalCount: data.totalCount || 0,
      page: data.pageNumber || page,
      pageSize: data.pageSize || pageSize,
      totalPages: data.totalPages || 0
    };
  } catch (error) {
    console.error('Error fetching paged materials:', error.response || error);
    // Fallback to empty state on error
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

export const createMaterialWithFile = async (formData) => {
  try {
    const response = await apiClient.post('/Materials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating material with file:', error.response || error);
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

export const updateMaterialWithFile = async (materialId, formData) => {
  if (!materialId) {
    return Promise.reject(new Error('Material ID is required.'));
  }
  try {
    const response = await apiClient.put(`/Materials/upload/${materialId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating material with file ${materialId}:`, error.response || error);
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

export const getMaterialsByInstructorId = async () => {
  try {
    const response = await apiClient.get(`/Materials/instructor`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapMaterialFromApi);
  } catch (error) {
    console.error(`Error fetching materials for instructor:`, error.response || error);
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