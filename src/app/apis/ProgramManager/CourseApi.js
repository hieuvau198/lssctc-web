const BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Courses`;

export async function fetchCourses({
  pageNumber = 1,
  pageSize = 12,
  searchTerm = "",
  categoryId,
  levelId,
  isActive,
} = {}) {
  const params = new URLSearchParams({
    PageNumber: pageNumber,
    PageSize: pageSize,
    SearchTerm: searchTerm,
  });

  if (categoryId !== undefined) params.append("CategoryId", categoryId);
  if (levelId !== undefined) params.append("LevelId", levelId);
  if (isActive !== undefined) params.append("IsActive", isActive);

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  return response.json();
}

export async function fetchCourseDetail(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch course detail");
  }
  return response.json();
}

export async function addCourse(course) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  if (!response.ok) {
    throw new Error("Failed to add course");
  }
  return response.json();
}

export async function updateCourse(id, course) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  });
  if (!response.ok) {
    throw new Error("Failed to update course");
  }
  return response.json();
}

// Fetch all course categories
export async function fetchCourseCategories() {
  const response = await fetch(`${BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch course categories");
  }
  return response.json();
}

// Fetch all course levels
export async function fetchCourseLevels() {
  const response = await fetch(`${BASE_URL}/levels`);
  if (!response.ok) {
    throw new Error("Failed to fetch course levels");
  }
  return response.json();
}
