// src\app\apis\Instructor\InstructorSectionApi.js

import apiClient from '../../libs/axios';

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

const mapQuizFromApi = (item) => ({
  id: item.id,
  name: item.name,
  passScoreCriteria: item.passScoreCriteria,
  timelimitMinute: item.timelimitMinute,
  totalScore: item.totalScore,
  description: item.description,
});

const mapPracticeFromApi = (item) => ({
  id: item.id,
  practiceName: item.practiceName,
  practiceDescription: item.practiceDescription,
  estimatedDurationMinutes: item.estimatedDurationMinutes,
  difficultyLevel: item.difficultyLevel,
  maxAttempts: item.maxAttempts,
  createdDate: item.createdDate,
  isActive: item.isActive,
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

export const createActivity = async (payload) => {
  try {
    const response = await apiClient.post('/Activities', payload);
    return mapActivityFromApi(response.data);
  } catch (error) {
    console.error('Error creating activity:', error.response || error);
    throw error.response?.data || error;
  }
};

export const assignActivityToSection = async (sectionId, activityId) => {
  if (!sectionId || !activityId) {
    return Promise.reject(new Error('Section ID and Activity ID are required.'));
  }
  try {
    const response = await apiClient.post(`/Activities/section/${sectionId}/activity/${activityId}`);
    return response.data;
  } catch (error) {
    console.error(`Error assigning activity ${activityId} to section ${sectionId}:`, error.response || error);
    throw error.response?.data || error;
  }
};

export const getQuizzesByActivityId = async (activityId) => {
  if (!activityId) {
    console.warn('getQuizzesByActivityId called without activityId');
    return [];
  }
  try {
    const response = await apiClient.get(`/Quizzes/activity/${activityId}/quizzes`);
    const data = Array.isArray(response.data.data) ? response.data.data : [];
    return data.map(mapQuizFromApi);
  } catch (error) {
    console.error(`Error fetching quizzes for activity ${activityId}:`, error.response || error);
    return [];
  }
};

export const assignQuizToActivity = async (activityId, quizId) => {
  if (!activityId || !quizId) {
    return Promise.reject(new Error('Activity ID and Quiz ID are required.'));
  }
  try {
    const payload = { quizId, activityId };
    const response = await apiClient.post('/Quizzes/add-to-activity', payload);
    return response.data;
  } catch (error) {
    console.error(`Error assigning quiz ${quizId} to activity ${activityId}:`, error.response || error);
    throw error.response?.data || error;
  }
};

export const removeQuizFromActivity = async (activityId, quizId) => {
  if (!activityId || !quizId) {
    return Promise.reject(new Error('Activity ID and Quiz ID are required.'));
  }
  try {
    const response = await apiClient.delete(`/Quizzes/activity/${activityId}/quiz/${quizId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing quiz ${quizId} from activity ${activityId}:`, error.response || error);
    throw error.response?.data || error;
  }
};

export const getPracticesByActivityId = async (activityId) => {
  if (!activityId) {
    console.warn('getPracticesByActivityId called without activityId');
    return [];
  }
  try {
    const response = await apiClient.get(`/Practices/activity/${activityId}`);
    const data = Array.isArray(response.data) ? response.data : [];
    return data.map(mapPracticeFromApi);
  } catch (error) {
    console.error(`Error fetching practices for activity ${activityId}:`, error.response || error);
    return [];
  }
};

export const assignPracticeToActivity = async (activityId, practiceId) => {
  if (!activityId || !practiceId) {
    return Promise.reject(new Error('Activity ID and Practice ID are required.'));
  }
  try {
    const response = await apiClient.post(`/Practices/activity/${activityId}/add/${practiceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error assigning practice ${practiceId} to activity ${activityId}:`, error.response || error);
    throw error.response?.data || error;
  }
};

export const removePracticeFromActivity = async (activityId, practiceId) => {
  if (!activityId || !practiceId) {
    return Promise.reject(new Error('Activity ID and Practice ID are required.'));
  }
  try {
    const response = await apiClient.delete(`/Practices/activity/${activityId}/remove/${practiceId}`);
    return response.data;
  } catch (error) {
    console.error(`Error removing practice ${practiceId} from activity ${activityId}:`, error.response || error);
    throw error.response?.data || error;
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
