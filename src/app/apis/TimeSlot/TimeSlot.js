import apiClient from '../../libs/axios';

/**
 * POST /api/Timeslots
 * API cho Admin/Giảng viên tạo một timeslot mới cho một lớp học
 * @param {Object} data - Dữ liệu timeslot cần tạo
 * @returns {Promise}
 */
export const createTimeslot = async (data) => {
  const response = await apiClient.post('/Timeslots', data);
  return response.data;
};

/**
 * GET /api/Timeslots/class/{classId}/instructor-view
 * API cho giảng viên xem danh sách slot dạy cho 1 lớp
 * @param {string|number} classId - ID của lớp học
 * @returns {Promise}
 */
export const getInstructorClassTimeslots = async (classId) => {
  const response = await apiClient.get(`/Timeslots/class/${classId}/instructor-view`);
  return response.data;
};

/**
 * GET /api/Timeslots/instructor-schedule/week
 * API cho giảng viên xem danh sách tất cả slot dạy trong mỗi tuần
 * @param {Object} params - Query params (có thể bao gồm weekStart, weekEnd)
 * @returns {Promise}
 */
export const getInstructorWeeklySchedule = async (params = {}) => {
  const response = await apiClient.get('/Timeslots/instructor-schedule/week', { params });
  return response.data;
};

/**
 * GET /api/Timeslots/{timeslotId}/attendance-list
 * API cho giảng viên lấy danh sách học viên cần điểm danh cho 1 slot
 * @param {string|number} timeslotId - ID của timeslot
 * @returns {Promise}
 */
export const getAttendanceList = async (timeslotId) => {
  const response = await apiClient.get(`/Timeslots/${timeslotId}/attendance-list`);
  return response.data;
};

/**
 * POST /api/Timeslots/{timeslotId}/submit-attendance
 * API cho giảng viên submit danh sách điểm danh cho 1 slot
 * @param {string|number} timeslotId - ID của timeslot
 * @param {Array} attendanceData - Danh sách điểm danh
 * @returns {Promise}
 */
export const submitAttendance = async (timeslotId, attendanceData) => {
  const response = await apiClient.post(`/Timeslots/${timeslotId}/submit-attendance`, attendanceData);
  return response.data;
};

/**
 * GET /api/Timeslots/class/{classId}/trainee-view
 * API cho học viên xem danh sách slot cho 1 lớp
 * @param {string|number} classId - ID của lớp học
 * @returns {Promise}
 */
export const getTraineeClassTimeslots = async (classId) => {
  const response = await apiClient.get(`/Timeslots/class/${classId}/trainee-view`);
  return response.data;
};

/**
 * GET /api/Timeslots/trainee-schedule/week
 * API cho học viên xem danh sách tất cả slot cho 1 tuần
 * @param {Object} params - Query params (có thể bao gồm weekStart, weekEnd)
 * @returns {Promise}
 */
export const getTraineeWeeklySchedule = async (params = {}) => {
  const response = await apiClient.get('/Timeslots/trainee-schedule/week', { params });
  return response.data;
};

export default {
  createTimeslot,
  getInstructorClassTimeslots,
  getInstructorWeeklySchedule,
  getAttendanceList,
  submitAttendance,
  getTraineeClassTimeslots,
  getTraineeWeeklySchedule,
};
