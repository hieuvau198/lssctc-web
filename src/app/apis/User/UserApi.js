// src\app\apis\User\UserApi.js

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL || import.meta.env.VITE_API_BASE_URL;

/**
 * Get user by ID
 * GET /api/Users/{userId}
 * @param {number} userId - User ID
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} User data
 */
export async function getUserById(userId, token) {
  const response = await fetch(`${API_BASE_URL}/Users/${userId}`, {
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
 * Get current user info
 * @param {string} token - JWT Bearer token
 * @returns {Promise<Object>} Current user data
 */
export async function getCurrentUser(token) {
  // Decode token to get user ID
  try {
    const { jwtDecode } = await import('jwt-decode');
    const decoded = jwtDecode(token);
    const userId = decoded.nameid;
    
    if (!userId) {
      throw new Error('No user ID found in token');
    }
    
    return getUserById(userId, token);
  } catch (err) {
    throw new Error('Failed to get current user: ' + err.message);
  }
}
