// src/app/apis/Trainee/TraineeQuizApi.js
import apiClient from '../../libs/axios';

const api = apiClient;

// --- MAPPER CHO GET /Quizzes/for-trainee/activity/{id} ---
// (Mapper này không đổi vì response body giống nhau)
const mapQuizOption = (item) => ({
  id: item.id,
  quizQuestionId: item.quizQuestionId,
  name: item.name,
  description: item.description,
  displayOrder: item.displayOrder,
  optionScore: item.optionScore,
});

const mapQuizQuestion = (item) => ({
  id: item.id,
  quizId: item.quizId,
  name: item.name,
  questionScore: item.questionScore,
  description: item.description,
  isMultipleAnswers: item.isMultipleAnswers,
  options: Array.isArray(item.options) ? item.options.map(mapQuizOption) : [],
});

const mapQuizForTrainee = (item) => ({
  id: item.id,
  name: item.name,
  passScoreCriteria: item.passScoreCriteria,
  timelimitMinute: item.timelimitMinute,
  totalScore: item.totalScore,
  description: item.description,
  questions: Array.isArray(item.questions) ? item.questions.map(mapQuizQuestion) : [],
});

// --- MAPPER CHO POST /QuizAttempts/my-attempts/submit ---
// (Mapper này không đổi)
const mapQuizAttemptAnswer = (item) => ({
// ... (giữ nguyên)
  id: item.id,
  quizOptionId: item.quizOptionId,
  isCorrect: item.isCorrect,
  name: item.name,
});

const mapQuizAttemptQuestion = (item) => ({
// ... (giữ nguyên)
  id: item.id,
  questionId: item.questionId,
  attemptScore: item.attemptScore,
  questionScore: item.questionScore,
  isCorrect: item.isCorrect,
  isMultipleAnswers: item.isMultipleAnswers,
  name: item.name,
  quizAttemptAnswers: Array.isArray(item.quizAttemptAnswers)
    ? item.quizAttemptAnswers.map(mapQuizAttemptAnswer)
    : [],
});

export const mapQuizAttempt = (item) => ({
// ... (giữ nguyên)
  id: item.id,
  activityRecordId: item.activityRecordId,
  quizId: item.quizId,
  name: item.name,
  attemptScore: item.attemptScore,
  maxScore: item.maxScore,
  quizAttemptDate: item.quizAttemptDate,
  status: item.status,
  attemptOrder: item.attemptOrder,
  isPass: item.isPass,
  isCurrent: item.isCurrent,
  quizAttemptQuestions: Array.isArray(item.quizAttemptQuestions)
    ? item.quizAttemptQuestions.map(mapQuizAttemptQuestion)
    : [],
});

// --- HÀM API ---

/**
 * Lấy chi tiết quiz cho trainee BẰNG ACTIVITY ID
 * GET /api/Quizzes/for-trainee/activity/{activityId}
 */
export const getQuizByActivityIdForTrainee = async (activityId) => {
  if (activityId == null) throw new Error('activityId is required');
  // --- THAY ĐỔI ENDPOINT ---
  const response = await api.get(`/Quizzes/for-trainee/activity/${activityId}`);
  // --- KẾT THÚC THAY ĐỔI ---
  return mapQuizForTrainee(response.data);
};

export const getQuizByActivityRecordId = async (activityRecordId) => {
  if (!activityRecordId) throw new Error("ActivityRecordId is required");
  const response = await api.get(`/Quizzes/trainee/activity-record/${activityRecordId}`);
  return response.data; // Trả về { quiz: {...}, sessionStatus: {...} }
};

/**
 * Nộp bài làm quiz
 * POST /api/QuizAttempts/my-attempts/submit
 */
export const submitQuizAttempt = async (payload) => {
  if (payload == null) throw new Error('payload is required');
  const response = await api.post('/QuizAttempts/my-attempts/submit', payload);
  return mapQuizAttempt(response.data);
};