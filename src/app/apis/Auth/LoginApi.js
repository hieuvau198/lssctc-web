import apiClient from '../../libs/axios';

/**
 * Login using email and password.
 * POST /Authens/login-email
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{userName: string, accessToken: string, expiresIn: number}>}
 */
export async function loginEmail(email, password) {
  const response = await apiClient.post('/Authens/login-email', {
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
  const response = await apiClient.post('/Authens/login-username', {
    username,
    password,
  });
  return response.data;
}

export async function loginGoogle(googleToken) {
  const response = await apiClient.post('/Authens/login-google', {
    accessToken: googleToken,
  });

  return response.data;
}

export default {
  loginEmail,
  loginUsername,
  loginGoogle
};