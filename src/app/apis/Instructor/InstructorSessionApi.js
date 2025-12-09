import apiClient from '../../libs/axios';

const SESSION_URL = '/activity-sessions';

/**
 * Fetches all activity sessions for a specific class.
 * @param {number} classId 
 * @returns {Promise<Array>} List of ActivitySessionDto
 */
export const getActivitySessionsByClassId = async (classId) => {
  try {
    const response = await apiClient.get(`${SESSION_URL}/class/${classId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to fetch activity sessions');
  }
};

/**
 * Updates an activity session (Active status, Start/End Time).
 * @param {number} sessionId 
 * @param {object} data { isActive, startTime, endTime }
 * @returns {Promise<object>} Updated ActivitySessionDto
 */
export const updateActivitySession = async (sessionId, data) => {
  try {
    const response = await apiClient.put(`${SESSION_URL}/${sessionId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || new Error('Failed to update activity session');
  }
};