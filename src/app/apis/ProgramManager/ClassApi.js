import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;

/**
 * Fetch paginated list of classes
 * @param {Object} params { page, pageSize }
 * @returns {Promise<Object>} { items, totalCount, page, pageSize, totalPages }
 */
export async function fetchClasses(params = {}) {
  const { page = 1, pageSize = 10 } = params;
  const res = await axios.get(
    `${API_BASE_URL}/Classes?page=${page}&pageSize=${pageSize}`
  );
  return res.data;
}

/**
 * Fetch class detail by id
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchClassDetail(id) {
  const res = await axios.get(`${API_BASE_URL}/Classes/${id}`);
  return res.data;
}

/**
 * Fetch classes by programCourseId
 * @param {number|string} programCourseId
 * @returns {Promise<Array>}
 */
export async function fetchClassesByProgramCourse(programCourseId) {
  const res = await axios.get(
    `${API_BASE_URL}/Classes/programcourse/${programCourseId}`
  );
  return res.data;
}

/**
 * Create a new class for a program course
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createClass(payload) {
  const res = await axios.post(`${API_BASE_URL}/Classes/create`, payload);
  return res.data;
}

/**
 * Update class info by id
 * @param {number|string} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updateClass(id, payload) {
  const res = await axios.put(`${API_BASE_URL}/Classes/${id}`, payload);
  return res.data;
}

/**
 * Delete class by id
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function deleteClass(id) {
  const res = await axios.delete(`${API_BASE_URL}/Classes/${id}`);
  return res.data;
}
