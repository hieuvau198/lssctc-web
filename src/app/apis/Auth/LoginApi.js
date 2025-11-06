import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;

/**
 * Login using email and password.
 * POST /Authens/login-email
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{userName: string, accessToken: string, expiresIn: number}>}
 */
export async function loginEmail(email, password) {
  const response = await axios.post(`${API_BASE_URL}/Authens/login-email`, {
    email,
    password,
  });
  return response.data;
}

/**
 * Login using username and password.
 * POST /Authens/login-username
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{userName: string, accessToken: string, expiresIn: number}>}
 */
export async function loginUsername(username, password) {
  const response = await axios.post(`${API_BASE_URL}/Authens/login-username`, {
    username,
    password,
  });
  return response.data;
}

export default {
  loginEmail,
  loginUsername,
};
