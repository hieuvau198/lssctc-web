// src\app\apis\Instructor\InstructorProfileApi.js

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL || import.meta.env.VITE_API_BASE_URL;

/**
 * Get full instructor profile by user ID
 * GET /api/InstructorProfiles/instructor/by-user/{userId}
 * @param {number} userId - User ID
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Complete instructor profile with user data
 */
export async function getInstructorProfileByUserId(userId, token) {
  const response = await fetch(`${API_BASE_URL}/InstructorProfiles/instructor/by-user/${userId}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Update instructor profile by user ID
 * PUT /api/InstructorProfiles/instructor/by-user/{userId}
 * @param {number} userId - User ID
 * @param {Object} profileData - Profile data to update
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Updated profile data
 */
export async function updateInstructorProfileByUserId(userId, profileData, token) {
  const response = await fetch(`${API_BASE_URL}/InstructorProfiles/instructor/by-user/${userId}`, {
    method: 'PUT',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(profileData),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}