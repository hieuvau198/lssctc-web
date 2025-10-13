// src\app\apis\Instructor\InstructorApi.js

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { Accept: "*/*" },
});

//#region Mapping Functions

const mapClassFromApi = (item) => ({
  classId: item.id,
  name: item.name,
  startDate: item.startDate,
  endDate: item.endDate,
  capacity: item.capacity,
  programCourseId: item.programCourseId,
  classCode: item.classCode?.name || null,
  description: item.description,
  status: item.status,
});

//#endregion

//#region Class APIs

// export const getInstructorClasses = async (instructorId) => {
//   try {
//     const response = await api.get(`/Classes/by-instructor/${instructorId}`);
//     // Support both back-end shapes: either { success: true, items: [...] } or direct paged response
//     const payload = response.data || {};
//     const rawItems = Array.isArray(payload.items) ? payload.items : (Array.isArray(payload) ? payload : []);
//     return rawItems.map(mapClassFromApi);
//   } catch (error) {
//     console.error("Error fetching classes by instructor:", error);
//     return [];
//   }
// };

export const getInstructorClasses = async (instructorId, { page = 1, pageSize = 20 } = {}) => {
  try {
    const qs = `?page=${encodeURIComponent(page)}&pageSize=${encodeURIComponent(pageSize)}`;
    const response = await api.get(`/Classes/by-instructor/${instructorId}${qs}`);
    const data = response.data || {};
    const items = Array.isArray(data.items) ? data.items.map(mapClassFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (error) {
    console.error('Error fetching paged classes by instructor:', error);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
};

//#endregion
