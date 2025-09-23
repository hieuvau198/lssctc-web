// get course
// get course category
// get program
// get trainee program
const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;

export async function fetchPrograms({
  pageNumber = 1,
  pageSize = 10,
  searchTerm = "",
  isActive = true,
  isDeleted = false,
  minDurationHours = 0,
  maxDurationHours = 100,
} = {}) {
  const params = new URLSearchParams({
    PageNumber: pageNumber,
    PageSize: pageSize,
    SearchTerm: searchTerm,
    IsActive: isActive,
    IsDeleted: isDeleted,
    MinDurationHours: minDurationHours,
    MaxDurationHours: maxDurationHours,
  });

  const response = await fetch(`${API_BASE_URL}/Programs?${params}`);
  if (!response.ok) {
    throw new Error("Failed to fetch programs");
  }
  return response.json();
}

const BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Programs`;
const COURSE_BASE_URL = `${
  import.meta.env.VITE_API_Program_Service_URL
}/Courses`;

export async function fetchProgramDetail(id) {
  const response = await fetch(`${BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch program detail");
  }
  return response.json();
}

// Fetch course detail by id
export async function fetchCourseDetail(id) {
  const response = await fetch(`${COURSE_BASE_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch course detail");
  }
  return response.json();
}
