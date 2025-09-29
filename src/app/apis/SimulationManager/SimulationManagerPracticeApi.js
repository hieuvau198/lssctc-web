// src/app/apis/SimulationManager/SimulationManagerPracticeApi.js

import axios from 'axios';

// Only use the base URL from env
const API_BASE = import.meta.env.VITE_API_Simulation_Service_URL;

// --- Practices CRUD --- //
export const getPractices = (page = 1, pageSize = 10) =>
  axios.get(`${API_BASE}/practices`, { params: { page, pageSize } }).then(res => res.data);

export const getPracticeById = (id) =>
  axios.get(`${API_BASE}/practices/${id}`).then(res => res.data);

export const createPractice = (data) =>
  axios.post(`${API_BASE}/practices`, data).then(res => res.data);

export const updatePractice = (id, data) =>
  axios.put(`${API_BASE}/practices/${id}`, data).then(res => res.data);

export const deletePractice = (id) =>
  axios.delete(`${API_BASE}/practices/${id}`).then(res => res.data);

// --- PracticeStep APIs --- //

// Get all steps for a practice (nếu còn endpoint này, vẫn giữ như cũ)
export const getPracticeStepsByPracticeId = (practiceId) =>
  axios.get(`${API_BASE}/PracticeSteps/practice/${practiceId}`).then(res => res.data);

// Get single step by id (now: /api/PracticeSteps/:id)
export const getPracticeStepById = (stepId) =>
  axios.get(`${API_BASE}/PracticeSteps/${stepId}`).then(res => res.data);

// Create step (kiểm tra lại endpoint, thường là POST /PracticeSteps)
export const createPracticeStep = (data) =>
  axios.post(`${API_BASE}/PracticeSteps`, data).then(res => res.data);

// Update step
export const updatePracticeStep = (stepId, data) =>
  axios.put(`${API_BASE}/PracticeSteps/${stepId}`, data).then(res => res.data);

// Delete step
export const deletePracticeStep = (stepId) =>
  axios.delete(`${API_BASE}/PracticeSteps/${stepId}`).then(res => res.data);


// --- PracticeStepComponent APIs --- //

// Lấy list component theo practiceStepId
export const getPracticeStepComponents = (practiceStepId) =>
  axios.get(`${API_BASE}/PracticeStepComponents/${practiceStepId}`).then(res => res.data);

// Tạo mới 1 component cho step
export const createPracticeStepComponent = (data) =>
  axios.post(`${API_BASE}/PracticeStepComponents`, data).then(res => res.data);

// Update order hoặc info của 1 component (id là componentId)
export const updatePracticeStepComponent = (id, data) =>
  axios.put(`${API_BASE}/PracticeStepComponents/${id}`, data).then(res => res.data);

// Xoá 1 component khỏi step
export const deletePracticeStepComponent = (id) =>
  axios.delete(`${API_BASE}/PracticeStepComponents/${id}`).then(res => res.data);

