import apiClient from '../../libs/axios';

const BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Courses`;

export async function fetchCourses(params = {}) {
  const searchParams = new URLSearchParams();
  if (params.pageNumber) searchParams.append("pageNumber", params.pageNumber);
  if (params.pageSize) searchParams.append("pageSize", params.pageSize);
  if (params.searchTerm) searchParams.append("searchTerm", params.searchTerm);
  if (params.sortBy) searchParams.append("sortBy", params.sortBy);
  if (params.sortDirection) searchParams.append("sortDirection", params.sortDirection);

  const response = await apiClient.get(`${BASE_URL}/paged?${searchParams}`);
  return { items: response.data.items, totalCount: response.data.totalCount };
}

export async function fetchCoursesPaged({ pageNumber = 1, pageSize = 10, searchTerm } = {}) {
  try {
    const searchParams = new URLSearchParams();
    searchParams.append('PageNumber', pageNumber);
    searchParams.append('PageSize', pageSize);
    if (searchTerm) searchParams.append('SearchTerm', searchTerm);

    const url = `${BASE_URL}/paged?${searchParams.toString()}`;
    const resp = await apiClient.get(url);
    const data = resp.data;

    // normalize to { items, totalCount }
    return {
      items: data.items || [],
      totalCount: data.totalCount || 0,
      pageNumber: data.pageNumber || pageNumber,
      pageSize: data.pageSize || pageSize,
    };
  } catch (err) {
    console.error('Error fetching courses paged:', err);
    throw err;
  }
}

export async function fetchAvailableCourses() {
  const response = await apiClient.get(`${BASE_URL}/available`);
  return response.data;
}

export async function fetchCourseDetail(id) {
  try {
    const resp = await apiClient.get(`${BASE_URL}/${id}`);
    return resp.data;
  } catch (err) {
    console.error('Error fetching course detail:', err);
    throw err;
  }
}

export async function fetchCoursesByProgram(programId) {
  try {
    const resp = await apiClient.get(`${BASE_URL}/program/${encodeURIComponent(programId)}`);
    const data = resp.data;

    if (Array.isArray(data)) return { items: data, totalCount: data.length };
    return data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message || 'Fetch courses by program failed';
    console.error('Error fetching courses by program:', msg);
    throw new Error(msg);
  }
}

export async function addCourse(course) {
  try {
    const resp = await apiClient.post(BASE_URL, course);
    return resp.data;
  } catch (err) {
    let msg = err.message || 'Error adding course';
    if (err.response && err.response.data) {
      msg = typeof err.response.data === 'object'
        ? JSON.stringify(err.response.data)
        : err.response.data;
    }
    console.error('Error adding course:', msg);
    throw new Error(msg);
  }
}

export async function updateCourse(id, course) {
  try {
    const resp = await apiClient.put(`${BASE_URL}/${id}`, course);
    return resp.data;
  } catch (err) {
    const msg = err?.response?.data || err.message;
    console.error('Error updating course:', msg);
    throw new Error(msg);
  }
}

export async function deleteCourse(id) {
  try {
    const resp = await apiClient.delete(`${BASE_URL}/${id}`);
    return resp.data;
  } catch (err) {
    const msg = err?.response?.data || err.message;
    console.error('Error deleting course:', msg);
    throw new Error(msg);
  }
}

export async function fetchCourseCategories() {
  try {
    const resp = await apiClient.get(`${BASE_URL}/categories`);
    const data = resp.data;
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({ id: item.id, name: item.name, description: item.description }));
  } catch (err) {
    console.error('Error fetching course categories:', err);
    throw err;
  }
}

export async function fetchClassesByCourse(courseId) {
  try {
    const resp = await apiClient.get(`${import.meta.env.VITE_API_Program_Service_URL}/Classes/course/${courseId}`);
    return Array.isArray(resp.data) ? resp.data : [];
  } catch (err) {
    console.error('Error fetching classes by course:', err);
    throw err;
  }
}

export async function fetchCourseLevels() {
  try {
    const resp = await apiClient.get(`${BASE_URL}/levels`);
    const data = resp.data;
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({ id: item.id, name: item.name, description: item.description }));
  } catch (err) {
    console.error('Error fetching course levels:', err);
    throw err;
  }
}
