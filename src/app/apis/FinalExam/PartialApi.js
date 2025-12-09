import apiClient from '../../libs/axios';

/**
 * GET /api/finalExams/partial/{partialId}/my-detail
 * Xem chi tiết câu hỏi một phần thi (TE/SE/PE) của chính mình (Học viên)
 * @param {string|number} partialId
 * @returns {Promise<Object>}
 */
export async function getMyPartialDetail(partialId) {
  const response = await apiClient.get(`/FinalExams/partial/${partialId}/my-detail`);
  return response.data;
}

/**
 * POST /api/finalExams/partial/{partialId}/start-te
 * Bắt đầu bài thi lý thuyết (TE) bằng Exam Code, ghi lại thời gian bắt đầu và trả về nội dung Quiz (Học viên)
 * @param {string|number} partialId
 * @param {Object} payload - { examCode: string }
 * @returns {Promise<Object>}
 */
export async function startTheoryExam(partialId, payload) {
  const response = await apiClient.post(`/FinalExams/partial/${partialId}/start-te`, payload);
  return response.data;
}

/**
 * POST /api/finalExams/partial/{partialId}/start-se
 * Bắt đầu bài thi mô phỏng (SE), ghi lại thời gian bắt đầu (Học viên)
 * @param {string|number} partialId
 * @param {Object} payload - { examCode: string }
 * @returns {Promise<Object>}
 */
export async function startSimulationExam(partialId, payload) {
  const response = await apiClient.post(`/FinalExams/partial/${partialId}/start-se`, payload);
  return response.data;
}

/**
 * GET /api/finalExams/partial/{partialId}/my-pe-submission
 * Xem chi tiết kết quả chấm điểm (Checklist) của bài thi Thực hành (PE) đã được Giáng viên chấm (Học viên)
 * @param {string|number} partialId
 * @returns {Promise<Object>}
 */
export async function getMyPracticalSubmission(partialId) {
  const response = await apiClient.get(`/FinalExams/partial/${partialId}/my-pe-submission`);
  return response.data;
}

/**
 * POST /api/finalExams/partial
 * Tạo một phần thi (Partial) cho Final Exam (Admin/Giáng viên)
 * @param {Object} payload - { finalExamId, type, duration, weight, etc. }
 * @returns {Promise<Object>}
 */
export async function createPartial(payload) {
  const response = await apiClient.post('/FinalExams/partial', payload);
  return response.data;
}

/**
 * POST /api/finalExams/class-partial
 * Cấu hình để thi cho TOÀN BỘ lớp học (Tạo partial cho tất cả học viên trong lớp)
 * @param {Object} payload - { classId, finalExamId, partialType, duration, etc. }
 * @returns {Promise<Object>}
 */
export async function createClassPartial(payload) {
  const response = await apiClient.post('/FinalExams/class-partial', payload);
  return response.data;
}

/**
 * PUT /api/finalExams/class-partial-config
 * Cập nhật cấu hình (trọng số, thời gian, checklist PE) cho TẤT CẢ các partial cùng loại trong một lớp
 * @param {Object} payload - { classId, partialType, duration, weight, checklistIds, etc. }
 * @returns {Promise<Object>}
 */
export async function updateClassPartialConfig(payload) {
  const response = await apiClient.put('/FinalExams/class-partial-config', payload);
  return response.data;
}

/**
 * PUT /api/finalExams/partial/{id}
 * Cập nhật thông tin một phần thi
 * @param {string|number} id
 * @param {Object} payload - { duration, weight, status, etc. }
 * @returns {Promise<Object>}
 */
export async function updatePartial(id, payload) {
  const response = await apiClient.put(`/FinalExams/partial/${id}`, payload);
  return response.data;
}

/**
 * DELETE /api/finalExams/partial/{id}
 * Xóa một phần thi khỏi Final Exam
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deletePartial(id) {
  const response = await apiClient.delete(`/FinalExams/partial/${id}`);
  return response.data;
}

/**
 * POST /api/finalExams/submit/pe/{partialId}
 * Chấm điểm bài thi Thực hành (PE) theo Checklist (Giáng viên)
 * @param {string|number} partialId
 * @param {Object} payload - { checklistResults: [{ checklistId, passed, notes }] }
 * @returns {Promise<Object>}
 */
export async function submitPracticalEvaluation(partialId, payload) {
  const response = await apiClient.post(`/FinalExams/submit/pe/${partialId}`, payload);
  return response.data;
}

/**
 * POST /api/finalExams/submit/te/{partialId}
 * Submit bài làm Lý thuyết (TE) của Học viên
 * @param {string|number} partialId
 * @param {Object} payload - { answers: [{ questionId, selectedOptionId }] }
 * @returns {Promise<Object>}
 */
export async function submitTheoryExam(partialId, payload) {
  const response = await apiClient.post(`/FinalExams/submit/te/${partialId}`, payload);
  return response.data;
}

/**
 * POST /api/finalExams/submit/se/{partialId}
 * Submit điểm bài thi Mô phỏng (SE) (Học viên)
 * @param {string|number} partialId
 * @param {Object} payload - { score, simulationData, etc. }
 * @returns {Promise<Object>}
 */
export async function submitSimulationExam(partialId, payload) {
  const response = await apiClient.post(`/FinalExams/submit/se/${partialId}`, payload);
  return response.data;
}

export default {
  getMyPartialDetail,
  startTheoryExam,
  startSimulationExam,
  getMyPracticalSubmission,
  createPartial,
  createClassPartial,
  updateClassPartialConfig,
  updatePartial,
  deletePartial,
  submitPracticalEvaluation,
  submitTheoryExam,
  submitSimulationExam,
};
