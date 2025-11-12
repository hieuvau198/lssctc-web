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

// ----------------------------------------------------------------
// ĐÃ XÓA: mapPartition VÀ getLearningPartition...
// ----------------------------------------------------------------

// ----------------------------------------------------------------
// ĐÃ XÓA: mapSectionMaterial VÀ getLearningSectionMaterial
// ----------------------------------------------------------------

// --- MAPPER MỚI CHO API MATERIAL CỦA BẠN ---
// Dựa trên JSON: /Materials/activities/{activityId}/materials
const mapMaterialFromActivity = (item) => ({
  id: item.id,
  activityId: item.activityId,
  learningMaterialId: item.learningMaterialId,
  name: item.name,
  description: item.description,
  learningMaterialType: item.learningMaterialType, // "Document" hoặc "Video"
  materialUrl: item.materialUrl,
});
// --- KẾT THÚC MAPPER MỚI ---

// ----------------------------------------------------------------
// ĐÃ XÓA: mapSectionQuiz VÀ getLearningSectionQuiz
// ----------------------------------------------------------------

// Map activity record returned by /ActivityRecords/my-records/class/{classId}/section/{sectionId}
const mapActivityRecord = (item) => ({
  activityRecordId: item.id,
  sectionRecordId: item.sectionRecordId,
  activityId: item.activityId,
  activityName: item.activityName ?? `Activity ${item.activityId}`, // SỬ DỤNG TRƯỜNG MỚI
  status: item.status,
  score: item.score,
  isCompleted: !!item.isCompleted,
  completedDate: item.completedDate ?? null,
  activityType: item.activityType, // SỬ DỤNG TRƯỜNG MỚI ("Material", "Quiz", "Practice")
  learningProgressId: item.learningProgressId,
  sectionId: item.sectionId,
  traineeId: item.traineeId,
  traineeName: item.traineeName,
  classId: item.classId,
});

// ----------------------------------------------------------------
// ĐÃ XÓA: getActivityById (Không còn cần thiết)
// ----------------------------------------------------------------

//endregion

//region Learning Sections APIs

// get learning sections by class id and trainee id
export const getLearningSectionsByClassIdAndTraineeId = async (classId, traineeId) => {
  const response = await api.get(`/SectionRecords/my-records/class/${classId}`);
  const arr = Array.isArray(response.data) ? response.data : [];
  return arr.map(mapSection);
};

export const getLearningSectionByIdAndTraineeId = async (sectionRecordId, traineeId) => {
  try {
    const response = await api.get(`/SectionRecords/${sectionRecordId}`);
    return mapSection(response.data);
  } catch (e) {
    const response = await api.get(`Section/${sectionRecordId}/trainee/${traineeId}`);
    return mapSection(response.data);
  }
};

export const getPagedLearningSectionsByClassIdAndTraineeId = async (classId, traineeId, pageIndex = 1, pageSize = 10) => {
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
 * Get activity records for a class + section for the current trainee
 */
export const getActivityRecordsByClassAndSection = async (classId, sectionId) => {
  const response = await api.get(`/ActivityRecords/my-records/class/${classId}/section/${sectionId}`);
  const arr = Array.isArray(response.data) ? response.data : [];
  return arr.map(mapActivityRecord);
};

//endregion

//#region Learning Section Mateirals APIs

// --- API MỚI CỦA BẠN ---
// Get materials for a specific activity
export const getMaterialsByActivityId = async (activityId) => {
  if (activityId == null) throw new Error('activityId is required');
  const response = await api.get(`/Materials/activities/${activityId}/materials`);
  const arr = Array.isArray(response.data) ? response.data : [];
  return arr.map(mapMaterialFromActivity);
};
// --- KẾT THÚC API MỚI ---

// Mark a section material as completed
export const markSectionMaterialAsCompleted = async (partitionId, traineeId) => {
  try {
    // 'partitionId' ở đây được hiểu là activityId
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
    // 'partitionId' ở đây được hiểu là activityId
    const response = await api.put(`/LearningsMaterials/sectionmaterials/partition/${partitionId}/trainee/${traineeId}/incomplete`);
    return response.status === 200;
  } catch (error) {
    console.error("Error marking material as not completed:", error);
    return false;
  }
};
//#endregion
