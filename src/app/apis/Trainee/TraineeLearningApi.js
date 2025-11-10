// src/app/apis/Trainee/TraineeLearningApi.js
import apiClient from '../../libs/axios';

// Re-use the central apiClient so Authorization header (token) is attached automatically
const api = apiClient;

//#region Mapping function

const mapSection = (item) => ({
  // Section record shape returned from /SectionRecords/my-records/class/{classId}
  sectionRecordId: item.id ?? item.sectionRecordId,
  sectionId: item.sectionId,
  sectionName: item.sectionName,
  sectionDescription: item.name ?? item.sectionDescription ?? null,
  sectionOrder: item.sectionOrder ?? null,
  durationMinutes: item.durationMinutes ?? null,
  sectionRecordStatus: item.sectionRecordStatus ?? null,
  classId: item.classId,
  isCompleted: !!item.isCompleted,
  sectionProgress: item.progress ?? item.sectionProgress ?? 0,
  isTraineeAttended: !!item.isTraineeAttended,
  traineeId: item.traineeId ?? null,
  traineeName: item.traineeName ?? null,
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

const mapSectionQuiz = (item) => ({
  sectionQuizId: item.sectionQuizId,
  quizId: item.quizId,
  learningRecordPartitionId: item.learningRecordPartitionId,
  sectionQuizAttemptId: item.sectionQuizAttemptId,
  quizName: item.quizName,
  passScoreCriteria: item.passScoreCriteria,
  timelimitMinute: item.timelimitMinute,
  totalScore: item.totalScore,
  description: item.description,
  isCompleted: item.isCompleted,
  attemptScore: item.attemptScore,
  lastAttemptIsPass: item.lastAttemptIsPass,
  lastAttemptDate: item.lastAttemptDate,
});

// Map activity record returned by /ActivityRecords/my-records/class/{classId}/section/{sectionId}
const mapActivityRecord = (item) => ({
  activityRecordId: item.id,
  sectionRecordId: item.sectionRecordId,
  activityId: item.activityId,
  status: item.status,
  score: item.score,
  isCompleted: !!item.isCompleted,
  completedDate: item.completedDate ?? null,
  activityType: item.activityType,
  learningProgressId: item.learningProgressId,
  sectionId: item.sectionId,
  traineeId: item.traineeId,
  traineeName: item.traineeName,
  classId: item.classId,
});

// Fetch activity metadata by id
export const getActivityById = async (activityId) => {
  if (activityId == null) throw new Error('activityId is required');
  const response = await api.get(`/Activities/${activityId}`);
  const d = response.data || {};
  return {
    activityId: d.id,
    activityTitle: d.activityTitle ?? d.name ?? null,
    activityDescription: d.activityDescription ?? d.description ?? null,
    activityType: d.activityType ?? null,
    estimatedDurationMinutes: d.estimatedDurationMinutes ?? d.durationMinutes ?? null,
  };
};

//endregion


//region Learning Classes APIs


//region Learning Sections APIs

// get learning sections by class id and trainee id
export const getLearningSectionsByClassIdAndTraineeId = async (classId, traineeId) => {
  // Use the new SectionRecords endpoint that returns the trainee's section records for a class.
  // The endpoint does not require traineeId because token identifies the trainee.
  const response = await api.get(`/SectionRecords/my-records/class/${classId}`);
  // response.data is expected to be an array
  const arr = Array.isArray(response.data) ? response.data : [];
  return arr.map(mapSection);
};

export const getLearningSectionByIdAndTraineeId = async (sectionRecordId, traineeId) => {
  // Attempt to fetch a specific section record by id from SectionRecords
  // Prefer server-side record endpoint if available
  try {
    const response = await api.get(`/SectionRecords/${sectionRecordId}`);
    return mapSection(response.data);
  } catch (e) {
    // Fallback: if endpoint not available, try the old route (keep compatibility)
    const response = await api.get(`Section/${sectionRecordId}/trainee/${traineeId}`);
    return mapSection(response.data);
  }
};

export const getPagedLearningSectionsByClassIdAndTraineeId = async (classId, traineeId, pageIndex = 1, pageSize = 10) => {
  // Try paged SectionRecords endpoint; if not present, fetch full list and page client-side
  try {
    const response = await api.get(`/SectionRecords/my-records/class/${classId}/paged`, {
      params: { pageIndex, pageSize },
    });

    const { items = [], totalCount = 0, page = pageIndex, pageSize: size = pageSize, totalPages = Math.max(1, Math.ceil(totalCount / (size || 1))) } = response.data || {};

    return {
      items: (Array.isArray(items) ? items : []).map(mapSection),
      totalCount,
      page,
      pageSize: size,
      totalPages,
    };
  } catch (err) {
    // Fallback: fetch all and paginate client-side
    const all = await getLearningSectionsByClassIdAndTraineeId(classId, traineeId);
    const totalCount = all.length;
    const start = (pageIndex - 1) * pageSize;
    const pagedItems = all.slice(start, start + pageSize);
    const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;
    return {
      items: pagedItems,
      totalCount,
      page: pageIndex,
      pageSize,
      totalPages,
    };
  }
};

//#endregion

//region Activity Records

/**
 * Get activity records for a class + section for the current trainee (token identifies trainee)
 * GET /ActivityRecords/my-records/class/{classId}/section/{sectionId}
 */
export const getActivityRecordsByClassAndSection = async (classId, sectionId) => {
  const response = await api.get(`/ActivityRecords/my-records/class/${classId}/section/${sectionId}`);
  const arr = Array.isArray(response.data) ? response.data : [];
  return arr.map(mapActivityRecord);
};

//endregion

//#region Learning Partitions APIs

export const getLearningPartitionsBySectionIdAndTraineeId = async (sectionId, traineeId) => {
  const response = await api.get(`/LearningsPartitions/partitions/section/${sectionId}/trainee/${traineeId}`);
  return response.data.map(mapPartition);
};

export const getLearningPartitionByIdAndTraineeId = async (partitionId, traineeId) => {
  const response = await api.get(`/LearningsPartitions/partition/${partitionId}/trainee/${traineeId}`);
  return mapPartition(response.data);
};

export const getPagedLearningPartitionsBySectionIdAndTraineeId = async (sectionId, traineeId, pageIndex = 1, pageSize = 10) => {
  const response = await api.get(`/LearningsPartitions/partitions/section/${sectionId}/trainee/${traineeId}/paged`, {
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
export const getLearningSectionMaterial = async (partitionId, traineeId) => {
  const response = await api.get(`/LearningsMaterials/sectionmaterials/partition/${partitionId}/trainee/${traineeId}`);
  return mapSectionMaterial(response.data);
};

// Mark a section material as completed
export const markSectionMaterialAsCompleted = async (partitionId, traineeId) => {
  try {
    const response = await api.put(`/LearningsMaterials/sectionmaterials/partition/${partitionId}/trainee/${traineeId}/complete`);
    return response.status === 200;
  } catch (error) {
    console.error("Error marking material as completed:", error);
    return false;
  }
};

// Mark a section material as not completed
export const markSectionMaterialAsNotCompleted = async (partitionId, traineeId) => {
  try {
    const response = await api.put(`/LearningsMaterials/sectionmaterials/partition/${partitionId}/trainee/${traineeId}/incomplete`);
    return response.status === 200;
  } catch (error) {
    console.error("Error marking material as not completed:", error);
    return false;
  }
};
//#endregion

//#region Learning Section Quizzes APIs
// Get a section quiz by partitionId and traineeId
export const getLearningSectionQuiz = async (partitionId, traineeId) => {
  const response = await api.get(`/LearningsQuizzes/sectionquizzes/partition/${partitionId}/trainee/${traineeId}`);
  return mapSectionQuiz(response.data);
};

//#endregion

