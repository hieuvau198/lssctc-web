// src\app\apis\Instructor\InstructorApi.js

import apiClient from '../../libs/axios';

//#region Mapping Functions

const mapClassFromApi = (item) => ({
  classId: item.id,
  name: item.name,
  startDate: item.startDate,
  endDate: item.endDate,
  capacity: item.capacity,
  programCourseId: item.programCourseId,
  classCode: item.classCode || null,
  description: item.description,
  status: item.status,
});

//#endregion

//#region Class APIs

export const getInstructorClasses = async (instructorId, { page = 1, pageSize = 20 } = {}) => {
  if (instructorId == null) {
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
  try {
    const qs = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const response = await apiClient.get(`/Classes/instructor/${instructorId}${qs}`);
    const data = response.data || {};

    // If backend returned a plain array
    if (Array.isArray(data)) {
      const mapped = data.map(mapClassFromApi);
      const totalCount = mapped.length;
      const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;
      return {
        items: mapped,
        totalCount,
        page,
        pageSize,
        totalPages,
        raw: data,
      };
    }

    // If backend returned a paged object with items
    const rawItems = Array.isArray(data.items) ? data.items : (Array.isArray(data) ? data : []);
    const items = rawItems.map(mapClassFromApi);
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || (pageSize > 0 ? Math.ceil(items.length / pageSize) : 1),
      raw: data,
    };
  } catch (error) {
    console.error('Error fetching paged classes by instructor:', error);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
};

export const getQuizzes = async ({ page = 1, pageSize = 20 } = {}) => {
  try {
    const qs = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const response = await apiClient.get(`/quizzes${qs}`);
    const data = response.data || {};

    if (Array.isArray(data)) {
      const totalCount = data.length;
      const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;
      return {
        items: data,
        totalCount,
        page,
        pageSize,
        totalPages,
        raw: data,
      };
    }

    const items = Array.isArray(data.items) ? data.items : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || (pageSize > 0 ? Math.ceil(items.length / pageSize) : 1),
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
};

export const getInstructorClassById = async (classId) => {
  if (!classId) {
    return Promise.reject(new Error("Class ID is required."));
  }
  try {
    const response = await apiClient.get(`/Classes/${classId}`);
    return response.data; // Returns the class detail object directly
  } catch (error) {
    console.error(`Error fetching class detail for ID ${classId}:`, error);
    throw error.response?.data || error;
  }
};

//#endregion
