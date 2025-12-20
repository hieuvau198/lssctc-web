// src/app/apis/SimulationManager/SimulationManagerTaskApi.js

import apiClient from "../../libs/axios";

function withAuth(headers = {}, token) {
  if (token) return { ...headers, Authorization: `Bearer ${token}` };
  return headers;
}

// --- Task CRUD --- //
export const getTaskById = (id, token) =>
  apiClient
    .get(`/Tasks/${id}`, { headers: withAuth({}, token) })
    .then((res) => {
      if (res.data?.success && res.data?.data) return res.data.data;
      return res.data;
    });

export const createTask = (practiceCode, data, token) =>
  apiClient
    .post(`/Tasks`, data, { headers: withAuth({}, token) })
    .then((res) => {
      if (res.data?.success && res.data?.data) return res.data.data;
      return res.data;
    });

export const updateTask = (id, data, token) =>
  apiClient
    .put(`/Tasks/${id}`, data, { headers: withAuth({}, token) })
    .then((res) => {
      if (res.data?.success && res.data?.data) return res.data.data;
      return res.data;
    });

export const deleteTask = (id, token) =>
  apiClient
    .delete(`/Tasks/${id}`, { headers: withAuth({}, token) })
    .then((res) => {
      if (res.data?.success && res.data?.data) return res.data.data;
      return res.data;
    });

export const deleteTaskFromPractice = (practiceId, taskId, token) =>
  apiClient
    .delete(`/Tasks/practice/${practiceId}/remove/${taskId}`, {
      headers: withAuth({}, token),
    })
    .then((res) => {
      if (res.data?.success && res.data?.data) return res.data.data;
      return res.data;
    });

export const getAllTasks = (pageNumber = 1, pageSize = 10, token) =>
  apiClient
    .get(`/Tasks/paged?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
      headers: withAuth({}, token),
    })
    .then((res) => {
      if (res.data?.success && res.data?.data) return res.data.data;
      return res.data;
    });

export const addTaskToPractice = (practiceId, taskId, token) =>
  apiClient
    .post(`/Tasks/practice/${practiceId}/add/${taskId}`, null, {
      headers: withAuth({}, token),
    })
    .then((res) => {
      if (res.data?.success && res.data?.data) return res.data.data;
      return res.data;
    });
