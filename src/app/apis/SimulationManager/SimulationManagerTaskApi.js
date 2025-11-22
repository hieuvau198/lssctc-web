// src/app/apis/SimulationManager/SimulationManagerTaskApi.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;
const API_BASE = `${API_BASE_URL}`;

// --- Task CRUD --- //
export const getTaskById = (id) =>
  axios.get(`${API_BASE}/Tasks/${id}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const createTask = (practiceCode, data) =>
  axios.post(`${API_BASE}/Tasks/practice/${practiceCode}`, data).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const updateTask = (id, data) =>
  axios.put(`${API_BASE}/Tasks/${id}`, data).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const deleteTask = (id) =>
  axios.delete(`${API_BASE}/Tasks/${id}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const deleteTaskFromPractice = (practiceId, taskId) =>
  axios.delete(`${API_BASE}/Tasks/practice/${practiceId}/remove/${taskId}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const getAllTasks = (pageNumber = 1, pageSize = 10) =>
  axios.get(`${API_BASE}/Tasks/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });

export const addTaskToPractice = (practiceId, taskId) =>
  axios.post(`${API_BASE}/Tasks/practice/${practiceId}/add/${taskId}`).then(res => {
    if (res.data.success && res.data.data) {
      return res.data.data;
    }
    return res.data;
  });
