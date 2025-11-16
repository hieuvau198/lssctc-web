// src/app/apis/SimulationManager/SimulationManagerPracticeApi.js

import apiClient from '../../libs/axios';

// Only use the base URL from env (may be different service)
const API_BASE = import.meta.env.VITE_API_Simulation_Service_URL;

// --- Practices CRUD --- //
export const getPractices = (page = 1, pageSize = 10) =>
  apiClient.get(`${API_BASE}/Practices`, { params: { page, pageSize } }).then(res => res.data);

export const getPracticeById = (id) =>
  apiClient.get(`${API_BASE}/Practices/${id}`).then(res => res.data);

export const createPractice = (data) =>
  apiClient.post(`${API_BASE}/Practices`, data).then(res => res.data);

export const updatePractice = (id, data) =>
  apiClient.put(`${API_BASE}/Practices/${id}`, data).then(res => res.data);

export const deletePractice = (id) =>
  apiClient.delete(`${API_BASE}/Practices/${id}`).then(res => res.data);

// --- PracticeStep APIs --- //

// Get all steps for a practice (nếu còn endpoint này, vẫn giữ như cũ)
export const getPracticeStepsByPracticeId = (practiceId) =>
  apiClient.get(`${API_BASE}/PracticeSteps/practice/${practiceId}`).then(res => res.data);

// Get single step by id (now: /api/PracticeSteps/:id)
export const getPracticeStepById = (stepId) =>
  apiClient.get(`${API_BASE}/PracticeSteps/${stepId}`).then(res => res.data);

// Create step (kiểm tra lại endpoint, thường là POST /PracticeSteps)
export const createPracticeStep = (data) =>
  apiClient.post(`${API_BASE}/PracticeSteps`, data).then(res => res.data);

// Update step
export const updatePracticeStep = (stepId, data) =>
  apiClient.put(`${API_BASE}/PracticeSteps/${stepId}`, data).then(res => res.data);

// Delete step
export const deletePracticeStep = (stepId) =>
  apiClient.delete(`${API_BASE}/PracticeSteps/${stepId}`).then(res => res.data);


// --- PracticeStepComponent APIs --- //

// get components by practiceStepId
export const getPracticeStepComponents = (practiceStepId) =>
  apiClient.get(`${API_BASE}/PracticeStepComponents/${practiceStepId}`).then(res => res.data);

// assign component to step, mean create practiceStepComponent
export const createPracticeStepComponent = (data) =>
  apiClient.post(`${API_BASE}/PracticeStepComponents`, data).then(res => res.data);

// Update display order of practiceStepComponent
export const updatePracticeStepComponent = (id, data) =>
  apiClient.put(`${API_BASE}/PracticeStepComponents/${id}`, data).then(res => res.data);

// remove a component from step, mean delete practiceStepComponent
export const deletePracticeStepComponent = (id) =>
  apiClient.delete(`${API_BASE}/PracticeStepComponents/${id}`).then(res => res.data);

