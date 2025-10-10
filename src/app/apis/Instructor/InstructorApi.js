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

export const getInstructorClasses = async (instructorId) => {
  try {
    const response = await api.get(`/Classes/by-instructor/${instructorId}`);
    if (response.data?.success && Array.isArray(response.data.items)) {
      return response.data.items.map(mapClassFromApi);
    }
    return [];
  } catch (error) {
    console.error("Error fetching classes by instructor:", error);
    return [];
  }
};

//#endregion
