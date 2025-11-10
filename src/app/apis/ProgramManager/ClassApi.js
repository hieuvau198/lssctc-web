import apiClient from '../../libs/axios';

/**
 * Fetch paginated list of classes
 * @param {Object} params { page, pageSize }
 * @returns {Promise<Object>} { items, totalCount, page, pageSize, totalPages }
 */
export async function fetchClasses(params = {}) {
  const { page = 1, pageSize = 10 } = params;
  const res = await apiClient.get(`/Classes?page=${page}&pageSize=${pageSize}`);
  const data = res.data;

  // If backend returns an array, normalize to a consistent paged shape
  if (Array.isArray(data)) {
    const totalCount = data.length;
    const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;
    return {
      items: data,
      totalCount,
      page,
      pageSize,
      totalPages,
    };
  }

  // otherwise assume server already returned a paged object
  return data;
}

/**
 * Fetch class detail by id
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function fetchClassDetail(id) {
  const res = await apiClient.get(`/Classes/${id}`);
  return res.data;
}

/**
 * Fetch classes by programCourseId
 * @param {number|string} programCourseId
 * @returns {Promise<Array>}
 */
export async function fetchClassesByProgramCourse(programCourseId) {
  const res = await apiClient.get(`/Classes/programcourse/${programCourseId}`);
  return res.data;
}

/**
 * Create a new class for a program course
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function createClass(payload) {
  const res = await apiClient.post(`/Classes/create`, payload);
  return res.data;
}

/**
 * Update class info by id
 * @param {number|string} id
 * @param {Object} payload
 * @returns {Promise<Object>}
 */
export async function updateClass(id, payload) {
  const res = await apiClient.put(`/Classes/${id}`, payload);
  return res.data;
}

/**
 * Delete class by id
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export async function deleteClass(id) {
  const res = await apiClient.delete(`/Classes/${id}`);
  return res.data;
}
