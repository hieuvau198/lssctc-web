import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;
const BASE = `${API_BASE_URL}`;

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

const mapPracticeFromApi = (item) => ({
  id: item.id,
  practiceName: item.practiceName,
  practiceCode: item.practiceCode, // Added
  practiceDescription: item.practiceDescription,
  estimatedDurationMinutes: item.estimatedDurationMinutes,
  difficultyLevel: item.difficultyLevel,
  maxAttempts: item.maxAttempts,
  createdDate: item.createdDate,
  isActive: item.isActive,
});

export async function getPractices({ page = 1, pageSize = 10 } = {}) {
  try {
    const qs = buildQuery({ page, pageSize });
    const { data } = await axios.get(`${BASE}/Practices/paged${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };

    const items = Array.isArray(data.items) ? data.items.map(mapPracticeFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching practices:', err);
    throw err;
  }
}

/**
 * Get tasks by practice ID. Assumes task DTO includes taskCode.
 * GET /api/Tasks/practice/{practiceId}
 * @param {number} practiceId
 * @param {string} token
 * @returns {Promise<Array>} List of tasks
 */
export async function getTasksByPracticeId(practiceId, token) {
  try {
    const { data } = await axios.get(`${BASE}/Tasks/practice/${practiceId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching tasks by practiceId:', err);
    throw err;
  }
}

/**
 * Update a practice
 * PUT /api/Practices/{id}
 */
export async function updatePractice(id, data, token) {
  try {
    const { data: updatedPractice } = await axios.put(`${BASE}/Practices/${id}`, data, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return updatedPractice;
  } catch (err) {
    console.error('Error updating practice:', err);
    throw err;
  }
}

/**
 * Update a task (SimTask)
 * PUT /api/Tasks/{id}
 */
export async function updateTask(id, data, token) {
  try {
    const { data: updatedTask } = await axios.put(`${BASE}/Tasks/${id}`, data, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return updatedTask;
  } catch (err) {
    console.error('Error updating task:', err);
    throw err;
  }
}

/**
 * Add a task to a practice
 * POST /api/Tasks/practice/{practiceId}/add/{taskId}
 */
export async function addTaskToPractice(practiceId, taskId, token) {
  try {
    const { data } = await axios.post(`${BASE}/Tasks/practice/${practiceId}/add/${taskId}`, null, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.error('Error adding task to practice:', err);
    throw err;
  }
}

/**
 * Remove a task from a practice
 * DELETE /api/Tasks/practice/{practiceId}/remove/{taskId}
 */
export async function removeTaskFromPractice(practiceId, taskId, token) {
  try {
    const { data } = await axios.delete(`${BASE}/Tasks/practice/${practiceId}/remove/${taskId}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return data;
  } catch (err) {
    console.error('Error removing task from practice:', err);
    throw err;
  }
}

/**
 * Get all tasks (SimTask)
 * GET /api/Tasks
 */
export async function getAllTasks(token) {
  try {
    const { data } = await axios.get(`${BASE}/Tasks`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error('Error fetching all tasks:', err);
    throw err;
  }
}

export default {
  getPractices,
  getTasksByPracticeId,
  updatePractice,
  updateTask,
  addTaskToPractice,
  removeTaskFromPractice,
  getAllTasks,
};