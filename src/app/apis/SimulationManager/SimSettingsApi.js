import apiClient from '../../libs/axios';

// Helper to attach token if manually provided (though usually handled by interceptors)
function withAuth(headers = {}, token) {
  if (token) return { ...headers, Authorization: `Bearer ${token}` };
  return headers;
}

export async function getSimSettings(token) {
  const res = await apiClient.get('/SimSettings', { headers: withAuth({}, token) });
  // The controller returns Ok(new { success = true, message, data })
  return res.data; 
}

export async function updateSimSettings(data, token) {
  const res = await apiClient.put('/SimSettings', data, { headers: withAuth({}, token) });
  return res.data;
}