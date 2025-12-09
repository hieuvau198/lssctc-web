import apiClient from '../../libs/axios';

const InstructorFEApi = {
  // Get all student final exams in a class (for grading/viewing codes)
  getByClass: (classId) => apiClient.get(`/FinalExams/class/${classId}`),

  // Get the configuration of exams for the class (for the main list)
  getClassConfig: (classId) => apiClient.get(`/FinalExams/class/${classId}/config`),

  // Create a new exam (partial) for the whole class
  createClassPartial: (data) => apiClient.post('/FinalExams/class-partial', data),

  // Update configuration for an exam type in the class
  updateClassPartialConfig: (data) => apiClient.put('/FinalExams/class-partial-config', data),

  // Generate an exam code for a specific student's exam
  generateCode: (id) => apiClient.post(`/FinalExams/${id}/generate-code`),

  // Finish/Finalize the exam for the class
  finishClassExam: (classId) => apiClient.post(`/FinalExams/class/${classId}/finish`),
};

export default InstructorFEApi;