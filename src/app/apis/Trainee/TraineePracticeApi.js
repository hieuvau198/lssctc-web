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
  taskCode: task.taskCode
});

/**
 * Maps a practice from the API response to a frontend object.
 * @param {object} practice - The raw practice item from the API.
 * @returns {object} - The mapped practice object.
 */
const mapPracticeFromApi = (practice) => {
  if (!practice) return null;
  return {
    id: practice.id,
    practiceName: practice.practiceName,
    practiceCode: practice.practiceCode,
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
  };
};

//#endregion

//#region Trainee Practice APIs

/**
 * Get all practices for a trainee within a specific class.
 * GET /api/Practices/trainee/class/{classId}
 */
export async function getTraineePracticesByClassId(classId) {
  if (!classId) {
    throw new Error('Class ID is required');
  }

  try {
    const response = await api.get(`/Practices/trainee/class/${classId}`);
    // Extract the actual data payload from the API response wrapper
    // The structure is { success: true, data: [...], ... }
    const payload = response.data?.data || response.data;
    
    if (Array.isArray(payload)) {
      return payload.map(mapPracticeFromApi);
    }
    
    return [];
  } catch (err) {
    console.error(`Error fetching practices for class ${classId}:`, err);
    throw err;
  }
}

/**
 * Get practice details and session status by Activity Record ID.
 * GET /api/Practices/trainee/activity-record/{activityRecordId}
 */
export async function getPracticeByActivityRecordId(activityRecordId) {
  if (!activityRecordId) {
    throw new Error('Activity Record ID is required');
  }
  try {
    const response = await api.get(`/Practices/trainee/activity-record/${activityRecordId}`);
    
    // Extract the actual data payload from the API response wrapper
    // The structure is { success: true, data: { practice: {...}, sessionStatus: {...} } }
    const payload = response.data?.data || response.data;
    
    return {
      practice: mapPracticeFromApi(payload.practice),
      sessionStatus: payload.sessionStatus
    };
  } catch (err) {
    console.error(`Error fetching practice for activity record ${activityRecordId}:`, err);
    throw err;
  }
}

export async function getPracticeAttemptsHistory(activityRecordId) {
  // Note: For the "me" endpoint, traineeId isn't strictly needed in the URL 
  // but we check it to ensure the user is logged in contextually.
  if (!activityRecordId) {
    console.warn("Missing activityRecordId for fetching history");
    return [];
  }

  try {
    // CHANGE: Update URL to '/PracticeAttempts/by-activity-record/me'
    // The backend retrieves TraineeId from the token, so we only need to pass activityRecordId as a query param.
    const response = await api.get(`/PracticeAttempts/by-activity-record/me`, {
      params: { activityRecordId } 
    });
    
    return response.data || [];
  } catch (err) {
    console.error(`Error fetching attempts for practice ${activityRecordId}:`, err);
    return [];
  }
}

//#endregion

export default {
  getTraineePracticesByClassId,
  getPracticeByActivityRecordId,
  getPracticeAttemptsHistory,
};