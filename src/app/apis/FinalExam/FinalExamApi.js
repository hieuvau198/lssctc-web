import apiClient from '../../libs/axios';

/**
 * POST /api/finalExams
 * Tạo một Final Exam cho một Enrollment (Admin/Giáng viên)
 * @param {Object} payload - { enrollmentId, name, description, duration, passingScore, etc. }
 * @returns {Promise<Object>}
 */
export async function createFinalExam(payload) {
  const response = await apiClient.post('/finalExams', payload);
  return response.data;
}

/**
 * GET /api/finalExams/{id}
 * Lấy chi tiết một Final Exam theo ID
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export async function getFinalExamById(id) {
  const response = await apiClient.get(`/finalExams/${id}`);
  return response.data;
}

/**
 * PUT /api/finalExams/{id}
 * Cập nhật thông tin một Final Exam (Pass/Fail, TotalMarks)
 * @param {string|number} id
 * @param {Object} payload - { passingScore, totalMarks, etc. }
 * @returns {Promise<Object>}
 */
export async function updateFinalExam(id, payload) {
  const response = await apiClient.put(`/finalExams/${id}`, payload);
  return response.data;
}

/**
 * DELETE /api/finalExams/{id}
 * Xóa một Final Exam
 * @param {string|number} id
 * @returns {Promise<void>}
 */
export async function deleteFinalExam(id) {
  const response = await apiClient.delete(`/finalExams/${id}`);
  return response.data;
}

/**
 * GET /api/finalExams/class/{classId}
 * Xem danh sách Final Exam của một lớp học (Admin/Giáng viên)
 * @param {string|number} classId
 * @returns {Promise<Array>}
 */
export async function getFinalExamsByClass(classId) {
  const response = await apiClient.get(`/finalExams/class/${classId}`);
  return response.data;
}

/**
 * GET /api/finalExams/class/{classId}/config
 * Get exam configuration (weights) for a class
 * @param {string|number} classId
 * @returns {Promise<Object>}
 */
export async function getClassExamConfig(classId) {
  const response = await apiClient.get(`/finalExams/class/${classId}/config`);
  return response.data;
}

/**
 * PUT /api/finalExams/class/{classId}/weights
 * Update exam weights for a class
 * @param {string|number} classId
 * @param {Object} payload - { theoryWeight, simulationWeight, practicalWeight }
 * @returns {Promise<Object>}
 */
export async function updateClassWeights(classId, payload) {
  const response = await apiClient.put(`/finalExams/class/${classId}/weights`, payload);
  return response.data;
}

/**
 * POST /api/finalExams/{id}/generate-code
 * Tạo một Exam Code ngẫu nhiên cho một Final Exam (cho TE)
 * @param {string|number} id
 * @returns {Promise<{code: string}>}
 */
export async function generateExamCode(id) {
  const response = await apiClient.post(`/finalExams/${id}/generate-code`);
  return response.data;
}

/**
 * POST /api/finalExams/class/{classId}/finish
 * Confirm một Final Exam đã kết thúc cho toàn bộ lớp học (Giáng viên)
 * @param {string|number} classId
 * @returns {Promise<Object>}
 */
export async function finishFinalExamForClass(classId) {
  const response = await apiClient.post(`/finalExams/class/${classId}/finish`);
  return response.data;
}

/**
 * GET /api/finalExams/my-history
 * Xem lịch sử Final Exam của chính mình (Học viên)
 * @returns {Promise<Array>}
 */
export async function getMyFinalExamHistory() {
  const response = await apiClient.get('/finalExams/my-history');
  return response.data;
}

/**
 * GET /api/finalExams/class/{classId}/my-exam
 * Xem Final Exam của chính mình trong lớp học (Học viên)
 * @param {string|number} classId
 * @returns {Promise<Object>}
 */
export async function getMyExamInClass(classId) {
  const response = await apiClient.get(`/finalExams/class/${classId}/my-exam`);
  return response.data;
}

export default {
  createFinalExam,
  getFinalExamById,
  updateFinalExam,
  deleteFinalExam,
  getFinalExamsByClass,
  getClassExamConfig,
  updateClassWeights,
  generateExamCode,
  finishFinalExamForClass,
  getMyFinalExamHistory,
  getMyExamInClass,
};