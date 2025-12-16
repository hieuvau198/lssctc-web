import apiClient from '../../libs/axios';
const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;

// Fetch list of programs with paging and search
export async function fetchPrograms(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.pageNumber) searchParams.append("pageNumber", params.pageNumber);
  if (params.pageSize) searchParams.append("pageSize", params.pageSize);
  if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);

  const response = await apiClient.get(`${API_BASE_URL}/Programs/paged?${searchParams}`);
  return response.data;
}

// Fetch program detail by id
export async function fetchProgramDetail(id) {
  const response = await apiClient.get(`${API_BASE_URL}/Programs/${id}`);
  return response.data;
}

// Update program basic info
export async function updateProgramBasic(id, payload) {
  const response = await apiClient.put(`${API_BASE_URL}/Programs/${id}`, payload);
  return response.data;
}

export async function fetchAvailablePrograms() {
  const response = await apiClient.get(`${API_BASE_URL}/Programs/available`);
  return response.data;
}

// Update program courses (with order)
export async function updateProgramCourses(id, courses) {
  try {
    const response = await apiClient.put(`${API_BASE_URL}/Programs/${id}/courses`, courses);
    return response.data;
  } catch (err) {
    // Return error response for special case
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw err;
  }
}

// Add a single course to a program by POSTing to /Programs/{programId}/courses/{courseId}
export async function addCourseToProgram(programId, courseId) {
  try {
    const response = await apiClient.post(`${API_BASE_URL}/Programs/${programId}/courses/${courseId}`);
    return response.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.message) {
      throw new Error(err.response.data.message);
    }
    throw err;
  }
}

// Update program entry requirements
export async function updateProgramEntryRequirements(id, requirements) {
  const response = await apiClient.put(`${API_BASE_URL}/Programs/${id}/entry-requirements`, requirements);
  return response.data;
}

// Create a new program
export async function createProgram(payload) {
  const response = await apiClient.post(`${API_BASE_URL}/Programs`, payload);
  return response.data;
}

// Delete program by id
export async function deleteProgram(id) {
  const response = await apiClient.delete(`${API_BASE_URL}/Programs/${id}`);
  return response.data;
}

// Fetch list of courses with paging and filtering
export async function fetchCourses(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.pageNumber) searchParams.append("PageNumber", params.pageNumber);
  if (params.pageSize) searchParams.append("PageSize", params.pageSize);
  if (params.searchTerm) searchParams.append("SearchTerm", params.searchTerm);
  if (params.categoryId) searchParams.append("CategoryId", params.categoryId);
  if (params.levelId) searchParams.append("LevelId", params.levelId);
  if (params.isActive !== undefined)
    searchParams.append("IsActive", params.isActive);

  const response = await apiClient.get(`${API_BASE_URL}/Courses?${searchParams}`);
  if (Array.isArray(response.data)) return { items: response.data, totalCount: response.data.length };
  return response.data;
}

// Fetch course detail by id
export async function fetchCourseDetail(id) {
  const response = await apiClient.get(`${API_BASE_URL}/Courses/${id}`);
  return response.data;
}
