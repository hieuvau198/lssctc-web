import axios from 'axios';
import { getAuthToken, removeAuthToken } from './cookies';

const BASE_URL = import.meta.env.VITE_API_Program_Service_URL;

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

// Request interceptor: add Authorization header from cookies on each request
apiClient.interceptors.request.use(
  (config) => {
    try {
      const token = getAuthToken();
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // swallow errors reading cookie
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle 401 globally (remove token and redirect to login)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401 && !error.config?.skipAuthRedirect) {
      try {
        // removeAuthToken();
      } catch (err) {}
      // if (typeof window !== 'undefined') {
      //   // ensure full reload to clear state
      //   window.location.replace('/auth/login');
      // }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

export { apiClient };
