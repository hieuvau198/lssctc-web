// src\app\apis\SimulationManager\SimulationManagerPracticeApi.js

import axios from 'axios';

// Use env variable for the API base
const API_BASE = `${import.meta.env.VITE_API_Simulation_Service_URL}/Practices`;

// Practices CRUD
export const getPractices = (page = 1, pageSize = 10) =>
  axios.get(API_BASE, { params: { page, pageSize } }).then(res => res.data);

export const getPracticeById = (id) =>
  axios.get(`${API_BASE}/${id}`).then(res => res.data);

export const createPractice = (data) =>
  axios.post(API_BASE, data).then(res => res.data);

export const updatePractice = (id, data) =>
  axios.put(`${API_BASE}/${id}`, data).then(res => res.data);

export const deletePractice = (id) =>
  axios.delete(`${API_BASE}/${id}`).then(res => res.data);

// --- PracticeStep APIs ---

export const getPracticeStepsByPracticeId = (practiceId) =>
  axios.get(`${API_BASE}/${practiceId}/steps`).then(res => res.data);

export const getPracticeStepById = (stepId) =>
  axios.get(`${API_BASE}/steps/${stepId}`).then(res => res.data);

export const createPracticeStep = (data) =>
  axios.post(`${API_BASE}/steps`, data).then(res => res.data);

export const updatePracticeStep = (stepId, data) =>
  axios.put(`${API_BASE}/steps/${stepId}`, data).then(res => res.data);

export const deletePracticeStep = (stepId) =>
  axios.delete(`${API_BASE}/steps/${stepId}`).then(res => res.data);




