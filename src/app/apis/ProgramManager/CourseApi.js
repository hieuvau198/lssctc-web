import axios from 'axios';

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

    const { data } = await axios.get(`${BASE_URL}`, { params });
    return data;
  } catch (err) {
    console.error('Error fetching courses:', err);
    throw err;
  }
}

export async function fetchCourseDetail(id) {
  try {
    const { data } = await axios.get(`${BASE_URL}/${id}`);
    return data;
  } catch (err) {
    console.error('Error fetching course detail:', err);
    throw err;
  }
}

export async function addCourse(course) {
  try {
    const { data } = await axios.post(BASE_URL, course);
    return data;
  } catch (err) {
    const msg = err?.response?.data?.message || err.message;
    console.error('Error adding course:', msg);
    throw new Error(msg);
  }
}

export async function updateCourse(id, course) {
  try {
    const { data } = await axios.put(`${BASE_URL}/${id}`, course);
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
    const { data } = await axios.delete(`${BASE_URL}/${id}`);
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
    const { data } = await axios.get(`${BASE_URL}/categories`);
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
    const { data } = await axios.get(`${BASE_URL}/levels`);
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
