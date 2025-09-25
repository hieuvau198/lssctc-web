// src\app\apis\SimulationManager\SimulationManagerPracticeApi.js

import axios from 'axios';

const API_BASE = 'https://localhost:7123/api/Practices';

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

// get practices by section id
// get practices by section partition id



