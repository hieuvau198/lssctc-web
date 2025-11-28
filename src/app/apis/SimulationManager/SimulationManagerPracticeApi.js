// src/app/apis/SimulationManager/SimulationManagerPracticeApi.js

import apiClient from '../../libs/axios';

// Sử dụng baseURL đã cấu hình trong apiClient (Program Service)
// Cho phép truyền token thủ công nếu cần override (ví dụ khi gọi với token khác)
function withAuth(headers = {}, token) {
  if (token) {
    return { ...headers, Authorization: `Bearer ${token}` };
  }
  return headers;
}

// --- Practices CRUD --- //
export const getPractices = (pageNumber = 1, pageSize = 10, token) => {
  const qs = new URLSearchParams({ pageNumber, pageSize }).toString();
  return apiClient.get(`/Practices/paged?${qs}`, { headers: withAuth({}, token) })
    .then(res => {
      if (res.data?.success && res.data?.data) return res.data.data;
      return res.data;
    });
};

export const getPracticeById = (id, token) =>
  apiClient.get(`/Practices/${id}`, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

export const createPractice = (data, token) =>
  apiClient.post(`/Practices`, data, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

export const updatePractice = (id, data, token) =>
  apiClient.put(`/Practices/${id}`, data, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

export const deletePractice = (id, token) =>
  apiClient.delete(`/Practices/${id}`, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// --- Tasks API --- //
export const getTasksByPracticeId = (practiceId, token) =>
  apiClient.get(`/Tasks/practice/${practiceId}`, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// --- PracticeStep APIs --- //

// Get all steps for a practice (nếu còn endpoint này, vẫn giữ như cũ)
export const getPracticeStepsByPracticeId = (practiceId, token) =>
  apiClient.get(`/PracticeSteps/practice/${practiceId}`, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// Get single step by id (now: /api/PracticeSteps/:id)
export const getPracticeStepById = (stepId, token) =>
  apiClient.get(`/PracticeSteps/${stepId}`, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// Create step (kiểm tra lại endpoint, thường là POST /PracticeSteps)
export const createPracticeStep = (data, token) =>
  apiClient.post(`/PracticeSteps`, data, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// Update step
export const updatePracticeStep = (stepId, data, token) =>
  apiClient.put(`/PracticeSteps/${stepId}`, data, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// Delete step
export const deletePracticeStep = (stepId, token) =>
  apiClient.delete(`/PracticeSteps/${stepId}`, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });


// --- PracticeStepComponent APIs --- //

// get components by practiceStepId
export const getPracticeStepComponents = (practiceStepId, token) =>
  apiClient.get(`/PracticeStepComponents/${practiceStepId}`, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// assign component to step, mean create practiceStepComponent
export const createPracticeStepComponent = (data, token) =>
  apiClient.post(`/PracticeStepComponents`, data, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// Update display order of practiceStepComponent
export const updatePracticeStepComponent = (id, data, token) =>
  apiClient.put(`/PracticeStepComponents/${id}`, data, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

// remove a component from step, mean delete practiceStepComponent
export const deletePracticeStepComponent = (id, token) =>
  apiClient.delete(`/PracticeStepComponents/${id}`, { headers: withAuth({}, token) }).then(res => {
    if (res.data?.success && res.data?.data) return res.data.data;
    return res.data;
  });

