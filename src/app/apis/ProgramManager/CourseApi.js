import apiClient from '../../libs/axios';

const BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Courses`;

export async function fetchCourses({ pageNumber = 1, pageSize = 10, searchTerm, categoryId, levelId, isActive } = {}) {
  try {
    const searchParams = new URLSearchParams();
    if (pageNumber) searchParams.append('PageNumber', pageNumber);
    if (pageSize) searchParams.append('PageSize', pageSize);
    if (searchTerm) searchParams.append('SearchTerm', searchTerm);
    if (categoryId !== undefined && categoryId !== null) searchParams.append('CategoryId', categoryId);
    if (levelId !== undefined && levelId !== null) searchParams.append('LevelId', levelId);
    if (isActive !== undefined && isActive !== null) searchParams.append('IsActive', isActive);

    const url = `${BASE_URL}`;
    const resp = await apiClient.get(url);
    const data = resp.data;

    // normalize to { items, totalCount }
    if (Array.isArray(data)) return { items: data, totalCount: data.length };
    return data;
  } catch (err) {
    console.error('Error fetching courses:', err);
    throw err;
  }
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
    const msg = err?.response?.data || err.message;
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
