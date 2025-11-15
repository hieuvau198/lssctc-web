// src\app\apis\Instructor\InstructorSectionApi.js

import apiClient from '../../libs/axios';

// Use apiClient which already sets baseURL to VITE_API_Program_Service_URL

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

const mapLearningMaterial = (item) => {
  const typeName = item.learningMaterialType ?? item.learningMaterialTypeName ?? null;
  let typeId = item.learningMaterialTypeId ?? null;
  if (!typeId && typeName) {
    const s = String(typeName).toLowerCase();
    if (s.includes('video')) typeId = 1; // Video = 1 in enum
    else if (s.includes('document') || s.includes('doc')) typeId = 2; // Document = 2
  }

  return {
    id: item.id,
    typeId,
    typeName,
    name: item.name,
    description: item.description,
    url: item.materialUrl ?? item.url ?? item.material_url ?? null,
    _raw: item,
  };
};

const mapSectionFromApi = (item) => ({
  id: item.id,
  title: item.sectionTitle,
  description: item.sectionDescription,
  duration: item.estimatedDurationMinutes,
});

const mapActivityFromApi = (item) => ({
  id: item.id,
  title: item.activityTitle,
  description: item.activityDescription,
  type: item.activityType,
  duration: item.estimatedDurationMinutes,
});

export const getSectionsByCourseId = async (courseId) => {
  if (!courseId) {
    console.warn('getSectionsByCourseId called without courseId');
    return [];
  }
  try {
    const response = await apiClient.get(`/Sections/course/${courseId}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapSectionFromApi);
  } catch (error) {
    console.error(`Error fetching sections for course ${courseId}:`, error.response || error);
    return [];
  }
};

export const getSectionById = async (sectionId) => {
  if (!sectionId) {
    console.warn('getSectionById called without sectionId');
    return null;
  }
  try {
    const response = await apiClient.get(`/Sections/${sectionId}`);
    return mapSectionFromApi(response.data);
  } catch (error) {
    console.error(`Error fetching section ${sectionId}:`, error.response || error);
    return null;
  }
};

export const getActivitiesBySectionId = async (sectionId) => {
  if (!sectionId) {
    console.warn('getActivitiesBySectionId called without sectionId');
    return [];
  }
  try {
    const response = await apiClient.get(`/Activities/section/${sectionId}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapActivityFromApi);
  } catch (error) {
    console.error(`Error fetching activities for section ${sectionId}:`, error.response || error);
    return [];
  }
};

export async function getLearningMaterials({ sectionId, page = 1, pageSize = 20 } = {}) {
  try {
    const qs = buildQuery({ sectionId, page, pageSize });
  const { data } = await apiClient.get(`/Materials/paged${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };

    // Support two shapes: an array (old/new simple endpoints) or paged object { items, totalCount, page, pageSize }
    const rawItems = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
    const items = rawItems.map(mapLearningMaterial);
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || Math.ceil((Number(data.totalCount) || items.length) / pageSize) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching learning materials:', err);
    return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
  }
}

export async function createLearningMaterial(payload) {
  try {
    if (!payload || !payload.name || !payload.materialUrl || !payload.learningMaterialType) {
      throw new Error('Missing required fields: name, materialUrl, learningMaterialType');
    }
    const { data } = await apiClient.post(`${BASE}/Materials`, payload);
    if (!data) return null;
    // If API returns the created object or a paged wrapper, handle accordingly
    const raw = Array.isArray(data) ? data[0] : data;
    return mapLearningMaterial(raw);
  } catch (err) {
    console.error('Error creating learning material:', err);
    throw err;
  }
}

export default {
  getLearningMaterials,
  createLearningMaterial
};
