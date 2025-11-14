// src\app\apis\Trainee\TraineeProfileApi.js

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL || import.meta.env.VITE_API_BASE_URL;

/**
 * Get full trainee profile by user ID (combines user info + profile in one call)
 * GET /api/Profiles/trainee/by-user/{userId}
 * @param {number} userId - User ID
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Complete trainee profile with user data
 */
export async function getTraineeProfileByUserId(userId, token) {
  const response = await fetch(`${API_BASE_URL}/Profiles/trainee/by-user/${userId}`, {
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
 * Get trainee profile by trainee ID
 * GET /api/Profiles/trainee/{traineeId}
 * @param {number} traineeId - Trainee ID
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Trainee profile data
 */
export async function getTraineeProfileById(traineeId, token) {
  const response = await fetch(`${API_BASE_URL}/Profiles/trainee/${traineeId}`, {
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
 * Update trainee profile
 * PUT /api/Profiles/trainee/{traineeId}
 * @param {number} traineeId - Trainee ID
 * @param {Object} profileData - Profile data to update
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Updated profile data
 */
export async function updateTraineeProfile(traineeId, profileData, token) {
  const response = await fetch(`${API_BASE_URL}/Profiles/trainee/${traineeId}`, {
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

/**
 * Upload driver license image
 * @param {number} traineeId - Trainee ID
 * @param {File} file - Image file
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Response with image URL
 */
export async function uploadDriverLicenseImage(traineeId, file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/Profiles/trainee/${traineeId}/driver-license/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Upload education certificate image
 * @param {number} traineeId - Trainee ID
 * @param {File} file - Image file
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Response with image URL
 */
export async function uploadEducationImage(traineeId, file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/Profiles/trainee/${traineeId}/education/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}

/**
 * Upload citizen card image
 * @param {number} traineeId - Trainee ID
 * @param {File} file - Image file
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Response with image URL
 */
export async function uploadCitizenCardImage(traineeId, file, token) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/Profiles/trainee/${traineeId}/citizen-card/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }

  return response.json();
}