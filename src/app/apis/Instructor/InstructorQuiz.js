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

    // Handle new API response format with wrapper
    let responseData = data;
    if (data?.data) {
      responseData = data.data;
    }

    if (!responseData) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };

    const items = Array.isArray(responseData.items) ? responseData.items.map(mapQuizFromApi) : [];
    return {
      items,
      totalCount: Number(responseData.totalCount) || items.length,
      page: Number(responseData.page) || pageIndex,
      pageSize: Number(responseData.pageSize) || pageSize,
      totalPages: Number(responseData.totalPages) || 1,
      raw: responseData,
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
  downloadQuizTemplate,
  importQuizFromExcel,
};

export async function getQuizDetail(quizId) {
  try {
    const { data } = await apiClient.get(`/Quizzes/${quizId}`);
    // Handle both old format (direct) and new format (with wrapper)
    return data?.data || data;
  } catch (err) {
    console.error('Error fetching quiz detail:', err);
    throw err;
  }
}

export async function createQuizWithQuestions(payload) {
  try {
    const { data } = await apiClient.post(`/Quizzes/with-questions`, payload);
    // Return full response including status, message, data
    return data;
  } catch (err) {
    console.error('Error creating quiz:', err);
    throw err;
  }
}

export async function updateQuizWithQuestions(quizId, payload) {
  try {
    const { data } = await apiClient.put(`/Quizzes/${quizId}/with-questions`, payload);
    // Return full response including status, message, data
    return data;
  } catch (err) {
    console.error('Error updating quiz:', err);
    throw err;
  }
}

/**
 * Tải xuống file Excel mẫu để nhập câu hỏi
 * Endpoint: /v1/downloads/quiz-template
 * @returns {Promise<void>}
 */
export async function downloadQuizTemplate() {
  try {
    // 1. Gọi API: Quan trọng nhất là responseType: 'blob' để Axios không parse JSON
    const response = await apiClient.get('v1/downloads/quiz-template', {
      responseType: 'blob',
    });

    // 2. Xác định tên file từ Header (nếu có) hoặc dùng tên mặc định
    let filename = 'Crane_Training_Quiz_Template.xlsx';
    const contentDisposition = response.headers['content-disposition'];

    if (contentDisposition) {
      // Thử parse filename*=UTF-8''filename.xlsx
      const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
      if (filenameStarMatch && filenameStarMatch[1]) {
        filename = decodeURIComponent(filenameStarMatch[1]);
      } else {
        // Thử parse filename="filename.xlsx"
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].trim();
        }
      }
    }

    // 3. Tạo Blob và link download giả
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';

    document.body.appendChild(link);

    // 4. Kích hoạt click và dọn dẹp
    setTimeout(() => {
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    }, 0);

  } catch (err) {
    console.error('Error downloading quiz template:', err);
    throw err;
  }
}

/**
 * Import quiz from Excel file
 * @param {Object} params - Import parameters
 */
export async function importQuizFromExcel({ file, name, passScoreCriteria, timelimitMinute, description }) {
  try {
    const formData = new FormData();

    // Bắt buộc
    formData.append('File', file);
    formData.append('Name', name);

    // Tùy chọn
    if (passScoreCriteria) formData.append('PassScoreCriteria', passScoreCriteria);
    if (timelimitMinute) formData.append('TimelimitMinute', timelimitMinute);
    if (description) formData.append('Description', description);

    const { data } = await apiClient.post('/Quizzes/import-excel', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return data;
  } catch (err) {
    console.error('Error importing quiz from Excel:', err);
    throw err;
  }
}