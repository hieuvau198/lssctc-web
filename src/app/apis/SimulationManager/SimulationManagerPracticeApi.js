// src/app/apis/SimulationManager/SimulationManagerPracticeApi.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;
const API_BASE = `${API_BASE_URL}`;

// --- Practices CRUD --- //
export const getPractices = (pageNumber = 1, pageSize = 10) => {
  const qs = new URLSearchParams({ pageNumber, pageSize }).toString();
  return axios.get(`${API_BASE}/Practices/paged?${qs}`).then(res => {
    // Handle new response format: { success, message, data: { items, totalCount, page, pageSize, totalPages } }
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });
};

export const getPracticeById = (id) =>
  axios.get(`${API_BASE}/Practices/${id}`).then(res => {
    // Handle new response format
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const createPractice = (data) =>
  axios.post(`${API_BASE}/Practices`, data).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const updatePractice = (id, data) =>
  axios.put(`${API_BASE}/Practices/${id}`, data).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const deletePractice = (id) =>
  axios.delete(`${API_BASE}/Practices/${id}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// --- Tasks API --- //
export const getTasksByPracticeId = (practiceId) =>
  axios.get(`${API_BASE}/Tasks/practice/${practiceId}`).then(res => {
    // Handle new response format
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// --- PracticeStep APIs --- //

// Get all steps for a practice (nếu còn endpoint này, vẫn giữ như cũ)
export const getPracticeStepsByPracticeId = (practiceId) =>
  axios.get(`${API_BASE}/PracticeSteps/practice/${practiceId}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// Get single step by id (now: /api/PracticeSteps/:id)
export const getPracticeStepById = (stepId) =>
  axios.get(`${API_BASE}/PracticeSteps/${stepId}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// Create step (kiểm tra lại endpoint, thường là POST /PracticeSteps)
export const createPracticeStep = (data) =>
  axios.post(`${API_BASE}/PracticeSteps`, data).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// Update step
export const updatePracticeStep = (stepId, data) =>
  axios.put(`${API_BASE}/PracticeSteps/${stepId}`, data).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// Delete step
export const deletePracticeStep = (stepId) =>
  axios.delete(`${API_BASE}/PracticeSteps/${stepId}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });


// --- PracticeStepComponent APIs --- //

// get components by practiceStepId
export const getPracticeStepComponents = (practiceStepId) =>
  axios.get(`${API_BASE}/PracticeStepComponents/${practiceStepId}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// assign component to step, mean create practiceStepComponent
export const createPracticeStepComponent = (data) =>
  axios.post(`${API_BASE}/PracticeStepComponents`, data).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// Update display order of practiceStepComponent
export const updatePracticeStepComponent = (id, data) =>
  axios.put(`${API_BASE}/PracticeStepComponents/${id}`, data).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

// remove a component from step, mean delete practiceStepComponent
export const deletePracticeStepComponent = (id) =>
  axios.delete(`${API_BASE}/PracticeStepComponents/${id}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

