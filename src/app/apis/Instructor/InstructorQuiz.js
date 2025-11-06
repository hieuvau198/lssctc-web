import apiClient from '../../libs/axios';
const BASE = '';

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

const mapQuizFromApi = (item) => ({
  id: item.id,
  name: item.name,
  passScoreCriteria: item.passScoreCriteria,
  timelimitMinute: item.timelimitMinute,
  totalScore: item.totalScore,
  description: item.description,
});

const mapQuizQuestionFromApi = (item) => ({
  id: item.id,
  quizId: item.quizId,
  name: item.name,
  questionScore: item.questionScore,
  description: item.description,
  isMultipleAnswers: item.isMultipleAnswers,
});

const mapQuizQuestionOptionFromApi = (item) => ({
  id: item.id,
  quizQuestionId: item.quizQuestionId,
  name: item.name,
  description: item.description,
  isCorrect: item.isCorrect,
  displayOrder: item.displayOrder,
  optionScore: item.optionScore,
});

export async function getQuizQuestionOptions(questionId) {
  try {
  const { data } = await apiClient.get(`/QuizQuestionOptions/questions/${questionId}/options`);
    if (!data) return { items: [], total: 0 };
    
    const items = Array.isArray(data.items) ? data.items.map(mapQuizQuestionOptionFromApi) : [];
    return {
      items,
      total: Number(data.total) || items.length,
      questionId: data.questionId || questionId,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching quiz question options:', err);
    throw err;
  }
}

/**
 * Update quiz by ID
 * @param {number} id - Quiz ID
 * @param {Object} payload - Quiz data to update
 * @returns {Promise<Object>} Updated quiz
 */
export async function updateQuiz(id, payload) {
  try {
  const { data } = await apiClient.put(`/Quizzes/${id}`, payload);
    return data;
  } catch (err) {
    console.error('Error updating quiz:', err);
    throw err;
  }
}

/**
 * Delete quiz by ID
 * @param {number} id - Quiz ID
 * @returns {Promise<void>}
 */
export async function deleteQuiz(id) {
  try {
  await apiClient.delete(`/Quizzes/${id}`);
  } catch (err) {
    console.error('Error deleting quiz:', err);
    throw err;
  }
}

/**
 * Update quiz question by ID
 * @param {number} questionId - Question ID
 * @param {Object} payload - Question data to update
 * @returns {Promise<Object>} Updated question
 */
export async function updateQuizQuestion(questionId, payload) {
  try {
  const { data } = await apiClient.put(`/QuizQuestions/questions/${questionId}`, payload);
    return data;
  } catch (err) {
    console.error('Error updating quiz question:', err);
    throw err;
  }
}

/**
 * Update quiz question option by ID
 * @param {number|string} optionId - Option ID
 * @param {Object} payload - Option data to update
 * @returns {Promise<Object>} Updated option
 */
export async function updateQuizQuestionOption(optionId, payload) {
  try {
  const { data } = await apiClient.put(`/QuizQuestionOptions/options/${optionId}`, payload);
    return data;
  } catch (err) {
    console.error('Error updating quiz question option:', err);
    throw err;
  }
}

/**
 * Delete quiz question by ID
 * @param {number} questionId - Question ID
 * @returns {Promise<void>}
 */
export async function deleteQuizQuestion(questionId) {
  try {
  await apiClient.delete(`/QuizQuestions/questions/${questionId}`);
  } catch (err) {
    console.error('Error deleting quiz question:', err);
    throw err;
  }
}

export async function getQuizById(id) {
  try {
  const { data } = await apiClient.get(`/Quizzes/${id}`);
    if (!data) throw new Error('Quiz not found');
    return mapQuizFromApi(data);
  } catch (err) {
    console.error('Error fetching quiz by ID:', err);
    throw err;
  }
}

export async function getQuizQuestions(quizId, { page = 1, pageSize = 10 } = {}) {
  try {
    const qs = buildQuery({ page, pageSize });
  const { data } = await apiClient.get(`/QuizQuestions/quiz/${quizId}/questions${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
    
    const items = Array.isArray(data.items) ? data.items.map(mapQuizQuestionFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching quiz questions:', err);
    throw err;
  }
}

export async function getQuizzes({ pageIndex = 1, pageSize = 10 } = {}) {
  try {
    const qs = buildQuery({ pageIndex, pageSize });
  const { data } = await apiClient.get(`/Quizzes${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
    
    const items = Array.isArray(data.items) ? data.items.map(mapQuizFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || pageIndex,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    throw err;
  }
}

export default {
  getQuizzes,
  getQuizById,
  getQuizQuestions,
  getQuizQuestionOptions,
  updateQuiz,
  deleteQuiz,
  updateQuizQuestion,
  updateQuizQuestionOption,
  deleteQuizQuestion,
};
