// src\app\apis\Trainee\TraineePracticeApi.js

import apiClient from '../../libs/axios';

// Re-use the central apiClient so Authorization header (token) is attached automatically
const api = apiClient;

//#region Mapping functions

/**
 * Maps a practice task from the API response to a frontend object.
 * @param {object} task - The raw task item from the API.
 * @returns {object} - The mapped task object.
 */
const mapPracticeTaskFromApi = (task) => ({
  taskId: task.taskId,
  practiceAttemptTaskId: task.practiceAttemptTaskId,
  taskName: task.taskName,
  taskDescription: task.taskDescription,
  expectedResult: task.expectedResult,
  isPass: task.isPass,
  score: task.score,
  description: task.description,
});

/**
 * Maps a practice from the API response to a frontend object.
 * @param {object} practice - The raw practice item from the API.
 * @returns {object} - The mapped practice object.
 */
const mapPracticeFromApi = (practice) => ({
  id: practice.id,
  practiceName: practice.practiceName,
  practiceDescription: practice.practiceDescription,
  estimatedDurationMinutes: practice.estimatedDurationMinutes,
  difficultyLevel: practice.difficultyLevel,
  maxAttempts: practice.maxAttempts,
  createdDate: practice.createdDate,
  isActive: practice.isActive,
  // Fields from the /trainee/class/{id} endpoint
  activityRecordId: practice.activityRecordId,
  activityId: practice.activityId,
  isCompleted: practice.isCompleted,
  tasks: Array.isArray(practice.tasks) ? practice.tasks.map(mapPracticeTaskFromApi) : [],
});

//#endregion

//#region Trainee Practice APIs

/**
 * Get all practices for a trainee within a specific class.
 * GET /api/Practices/trainee/class/{classId}
 * @param {number|string} classId - The ID of the class.
 * @returns {Promise<Array<object>>} - A promise resolving to an array of mapped practice objects.
 */
export async function getTraineePracticesByClassId(classId) {
  if (!classId) {
    throw new Error('Class ID is required');
  }

  try {
    const { data } = await api.get(`/Practices/trainee/class/${classId}`);
    
    if (Array.isArray(data)) {
      return data.map(mapPracticeFromApi);
    }
    
    // If response is not an array, return empty array as a fallback
    return [];
  } catch (err) {
    console.error(`Error fetching practices for class ${classId}:`, err);
    throw err; // Re-throw the error for the caller to handle
  }
}

export async function getPracticeByActivityRecordId(activityRecordId) {
  if (!activityRecordId) {
    throw new Error('Activity Record ID is required');
  }
  try {
    // This endpoint is an assumption based on the user's request
    // to use activityRecordId.
    const { data } = await api.get(`/Practices/trainee/activity-record/${activityRecordId}`);
    return mapPracticeFromApi(data);
  } catch (err) {
    console.error(`Error fetching practice for activity record ${activityRecordId}:`, err);
    throw err;
  }
}


//#endregion

export default {
  getTraineePracticesByClassId,
  getPracticeByActivityRecordId, // <-- Export hàm đã thay đổi
};