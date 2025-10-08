// src/app/apis/Trainee/TraineeLearningApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7212/api",
  headers: { Accept: "*/*" },
});

// Get all learning classes for a trainee
export const getLearningClassesByTraineeId = async (traineeId) => {
  const response = await api.get(`/Learnings/classes/trainee/${traineeId}`);
  return response.data;
};

// Get paged learning classes for a trainee
export const getPagedLearningClassesByTraineeId = async (traineeId, pageIndex = 1, pageSize = 10) => {
  const response = await api.get(`/Learnings/classes/trainee/${traineeId}/paged`, {
    params: { pageIndex, pageSize },
  });
  return response.data;
};

// Get a specific learning class by classId and traineeId
export const getLearningClassByIdAndTraineeId = async (classId, traineeId) => {
  const response = await api.get(`/Learnings/class/${classId}/trainee/${traineeId}`);
  return response.data;
};

// get class instructor by class id
// get learning sections by class id
// get learning section by section id
// get learning section partitions by section id
// get learning section partition by partition id

// get learning section material by partition id
// get learning section quiz by partition id
// get learning section practice by partition id

// get quiz attempts by quiz id and trainee id
// get practice attempts by practice id and trainee id

