// src\app\apis\Trainee\TraineeClassApi.js

import apiClient from '../../libs/axios';

/**
 * Builds a query string from an object.
 * @param {object} params - The query parameters.
 * @returns {string} - The formatted query string.
 */
function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

/**
 * Maps a class object from the API to a consistent frontend object.
 * @param {object} item - The raw class item from the API.
 * @returns {object} - The mapped class object.
 */
const mapClassFromApi = (item) => ({
  id: item.id,
  name: item.name || '',
  capacity: item.capacity || 0,
  classCode: item.classCode || 'N/A',
  programId: item.programId,
  courseId: item.courseId,
  description: item.description || '',
  startDate: item.startDate, // Consumers can parse date strings as needed
  endDate: item.endDate,
  status: item.status || 'Unknown',
  classProgress: item.classProgress ?? 0, // <-- ADDED THIS LINE
});

/**
 * Get all learning classes for a specific trainee.
 * @param {number|string} traineeId - The ID of the trainee.
 * @returns {Promise<Array<object>>} - A promise that resolves to an array of mapped class objects.
 */
export async function getLearningClassesByTraineeId(traineeId) {
  if (!traineeId) throw new Error('Trainee ID is required');
  try {
    const { data } = await apiClient.get(`/classes/trainee/${traineeId}`);
    if (!data) return [];

    // Standardize response: API might return an array or an object with an 'items' property
    const items = Array.isArray(data)
      ? data.map(mapClassFromApi)
      : Array.isArray(data.items)
      ? data.items.map(mapClassFromApi)
      : [];

    return items;
  } catch (err) {
    console.error(`Error fetching classes for trainee ${traineeId}:`, err);
    throw err;
  }
}

/**
 * Get paged learning classes for a specific trainee.
 * @param {number|string} traineeId - The ID of the trainee.
 * @param {object} params - Paging parameters (e.g., { pageNumber: 1, pageSize: 10 }).
 * @returns {Promise<{items: Array<object>, total: number, raw: object}>} - A promise that resolves to a paginated result.
 */
export async function getPagedLearningClassesByTraineeId(traineeId, params = {}) {
  if (!traineeId) throw new Error('Trainee ID is required');
  try {
    const qs = buildQuery(params); // Pass { pageNumber, pageSize } here
    const { data } = await apiClient.get(`/classes/trainee/${traineeId}/paged${qs}`);
    if (!data) return { items: [], total: 0 };

    // Standardize response
    const items = Array.isArray(data)
      ? data.map(mapClassFromApi)
      : Array.isArray(data.items)
      ? data.items.map(mapClassFromApi)
      : [];
    
    // API PagedResult uses 'totalCount'
    const total = data.total || data.totalCount || items.length;

    return { items, total: Number(total) || items.length, raw: data };
  } catch (err) {
    console.error(`Error fetching paged classes for trainee ${traineeId}:`, err);
    throw err;
  }
}

/**
 * Get a specific learning class for a specific trainee.
 * @param {number|string} traineeId - The ID of the trainee.
 * @param {number|string} classId - The ID of the class.
 * @returns {Promise<object>} - A promise that resolves to a single mapped class object.
 */
export async function getLearningClassByIdAndTraineeId(traineeId, classId) {
  if (!traineeId) throw new Error('Trainee ID is required');
  if (!classId) throw new Error('Class ID is required');

  try {
    // Using the URL from your C# Controller: [HttpGet("trainee/{traineeId}/class/{classId}")]
    const { data } = await apiClient.get(`/classes/trainee/${traineeId}/class/${classId}`);
    if (!data) throw new Error('Class not found for this trainee');
    return mapClassFromApi(data);
  } catch (err) {
    console.error(`Error fetching class ${classId} for trainee ${traineeId}:`, err);
    throw err;
  }
}

export default {
  getLearningClassesByTraineeId,
  getPagedLearningClassesByTraineeId,
  getLearningClassByIdAndTraineeId,
};