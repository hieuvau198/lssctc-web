import apiClient from '../../libs/axios';

const BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Courses`;

export async function fetchCourses({
  pageNumber = 1,
  pageSize = 10,
  searchTerm = "",
  categoryId,
  levelId,
  isActive,
} = {}) {
  try {
    const params = {
      PageNumber: pageNumber,
      PageSize: pageSize,
      SearchTerm: searchTerm,
    };
    if (categoryId !== undefined) params.CategoryId = categoryId;
    if (levelId !== undefined) params.LevelId = levelId;
    if (isActive !== undefined) params.IsActive = isActive;

    const { data } = await apiClient.get(`${BASE_URL}`, { params });

    // If backend returns an array, convert to paged shape and add name aliases
    if (Array.isArray(data)) {
      const items = data.map((item) => ({
        ...item,
        categoryName: item.categoryName ?? item.category,
        levelName: item.levelName ?? item.level,
      }));
      const totalCount = items.length;
      const totalPages = Math.max(1, Math.ceil(totalCount / (pageSize || totalCount)));
      return { items, totalCount, pageNumber, pageSize, totalPages };
    }

    // If backend returns a paged object, normalize mapping for name fields and ensure page meta exist
    const itemsRaw = data.items ?? data.data ?? [];
    const items = (Array.isArray(itemsRaw) ? itemsRaw : []).map((item) => ({
      ...item,
      categoryName: item.categoryName ?? item.category,
      levelName: item.levelName ?? item.level,
    }));
    const totalCount = data.totalCount ?? items.length;
    const page = data.pageNumber ?? data.page ?? pageNumber;
    const size = data.pageSize ?? data.pageSize ?? pageSize;
    const totalPages = data.totalPages ?? Math.max(1, Math.ceil(totalCount / (size || totalCount)));
    return { items, totalCount, pageNumber: page, pageSize: size, totalPages };
  } catch (err) {
    console.error('Error fetching courses:', err);
    throw err;
  }
}

export async function fetchCourseDetail(id) {
  try {
    const { data } = await apiClient.get(`${BASE_URL}/${id}`);
    return data;
  } catch (err) {
    console.error('Error fetching course detail:', err);
    throw err;
  }
}

export async function addCourse(course) {
  try {
    const { data } = await apiClient.post(BASE_URL, course);
    return data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    console.error('Error adding course:', msg);
    throw new Error(msg);
  }
}

export async function updateCourse(id, course) {
  try {
    const { data } = await apiClient.put(`${BASE_URL}/${id}`, course);
    return data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    console.error('Error updating course:', msg);
    throw new Error(msg);
  }
}

// Delete a course by id
export async function deleteCourse(id) {
  try {
    const { data } = await apiClient.delete(`${BASE_URL}/${id}`);
    return data || {};
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    console.error('Error deleting course:', msg);
    throw new Error(msg);
  }
}

// Fetch all course categories
export async function fetchCourseCategories() {
  try {
    const { data } = await apiClient.get(`${BASE_URL}/categories`);
    // Expecting an array like: [{id, name, description}, ...]
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    }));
  } catch (err) {
    console.error('Error fetching course categories:', err);
    throw err;
  }
}

// Fetch all course levels
export async function fetchCourseLevels() {
  try {
    const { data } = await apiClient.get(`${BASE_URL}/levels`);
    if (!Array.isArray(data)) return [];
    return data.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
    }));
  } catch (err) {
    console.error('Error fetching course levels:', err);
    throw err;
  }
}
