import apiClient from '../../libs/axios';

const api = apiClient;

export const getMyProgressInClass = async (classId) => {
  if (!classId) throw new Error("classId is required");
  const response = await api.get(`/Progress/my-progress/class/${classId}`);
  return response.data;
};