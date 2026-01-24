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

export async function uploadSimSource(file, token) {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await apiClient.post('/SimSettings/upload-source', formData, { 
    headers: withAuth({ 'Content-Type': 'multipart/form-data' }, token) 
  });
  return res.data;
}

export async function downloadSimSource(token) {
  const res = await apiClient.get('/SimSettings/download-source', { 
    headers: withAuth({}, token),
    responseType: 'blob' // Important for handling binary file download
  });
  return res;
}