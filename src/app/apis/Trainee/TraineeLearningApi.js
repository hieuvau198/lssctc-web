// src/app/apis/Trainee/TraineeLearningApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7212/api",
  headers: { Accept: "*/*" },
});

//#region Mapping function

const mapSection = (item) => ({
  sectionId: item.sectionId,
  sectionName: item.sectionName,
  sectionDescription: item.sectionDescription,
  sectionOrder: item.sectionOrder,
  durationMinutes: item.durationMinutes,
  sectionRecordStatus: item.sectionRecordStatus,
  classId: item.classId,
  sectionRecordId: item.sectionRecordId,
  isCompleted: item.isCompleted,
  sectionProgress: item.sectionProgress,
  isTraineeAttended: item.isTraineeAttended,
});

const mapPartition = (item) => ({
  sectionPartitionId: item.sectionPartitionId,
  sectionId: item.sectionId,
  partitionRecordId: item.partitionRecordId,
  partitionName: item.partitionName,
  partitionDescription: item.partitionDescription,
  partitionOrder: item.partitionOrder,
  partitionType: item.partitionType,
  partitionRecordStatus: item.partitionRecordStatus,
  isCompleted: item.isCompleted,
});

const mapSectionMaterial = (item) => ({
  sectionMaterialId: item.sectionMaterialId,
  materialId: item.materialId,
  partitionId: item.partitionId,
  partitionRecordId: item.partitionRecordId,
  materialName: item.materialName,
  materialDescription: item.materialDescription,
  materialType: item.materialType,
  materialUrl: item.materialUrl,
  partitionRecordStatus: item.partitionRecordStatus,
  isCompleted: item.isCompleted,
});

//#endregion


//#region Learning Classes APIs

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

// Get a specific learning class for a trainee
export const getLearningClassByIdAndTraineeId = async (classId, traineeId) => {
  const response = await api.get(`/Learnings/class/${classId}/trainee/${traineeId}`);
  return response.data;
};

//#endregion

//#region Learning Sections APIs

// get learning sections by class id and trainee id
export const getLearningSectionsByClassIdAndTraineeId = async (classId, traineeId) => {
  const response = await api.get(`/Learnings/sections/class/${classId}/trainee/${traineeId}`);
  return response.data.map(mapSection);
};

export const getLearningSectionByIdAndTraineeId = async (sectionId, traineeId) => {
  const response = await api.get(`/Learnings/section/${sectionId}/trainee/${traineeId}`);
  return mapSection(response.data);
};

export const getPagedLearningSectionsByClassIdAndTraineeId = async (classId, traineeId, pageIndex = 1, pageSize = 10) => {
  const response = await api.get(`/Learnings/sections/class/${classId}/trainee/${traineeId}/paged`, {
    params: { pageIndex, pageSize },
  });

  const { items, totalCount, page, pageSize: size, totalPages } = response.data;

  return {
    items: items.map(mapSection),
    totalCount,
    page,
    pageSize: size,
    totalPages,
  };
};

//#endregion

//#region Learning Partitions APIs

export const getLearningPartitionsBySectionIdAndTraineeId = async (sectionId, traineeId) => {
  const response = await api.get(`/Learnings/partitions/section/${sectionId}/trainee/${traineeId}`);
  return response.data.map(mapPartition);
};

export const getLearningPartitionByIdAndTraineeId = async (partitionId, traineeId) => {
  const response = await api.get(`/Learnings/partition/${partitionId}/trainee/${traineeId}`);
  return mapPartition(response.data);
};

export const getPagedLearningPartitionsBySectionIdAndTraineeId = async (sectionId, traineeId, pageIndex = 1, pageSize = 10) => {
  const response = await api.get(`/Learnings/partitions/section/${sectionId}/trainee/${traineeId}/paged`, {
    params: { pageIndex, pageSize },
  });

  const { items, totalCount, page, pageSize: size, totalPages } = response.data;

  return {
    items: items.map(mapPartition),
    totalCount,
    page,
    pageSize: size,
    totalPages,
  };
};

//#endregion

//#region Learning Section Mateirals APIs
// Get a section material by partitionId and traineeId
export const getSectionMaterialByPartitionIdAndTraineeId = async (partitionId, traineeId) => {
  const response = await api.get(`/Learnings/sectionmaterials/partition/${partitionId}/trainee/${traineeId}`);
  return mapSectionMaterial(response.data);
};

// Mark a section material as completed
export const markSectionMaterialAsCompleted = async (partitionId, traineeId) => {
  try {
    const response = await api.put(`/Learnings/sectionmaterials/partition/${partitionId}/trainee/${traineeId}/complete`);
    return response.status === 200;
  } catch (error) {
    console.error("Error marking material as completed:", error);
    return false;
  }
};

// Mark a section material as not completed
export const markSectionMaterialAsNotCompleted = async (partitionId, traineeId) => {
  try {
    const response = await api.put(`/Learnings/sectionmaterials/partition/${partitionId}/trainee/${traineeId}/incomplete`);
    return response.status === 200;
  } catch (error) {
    console.error("Error marking material as not completed:", error);
    return false;
  }
};
//#endregion

