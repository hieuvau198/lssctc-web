// get course
// get course category
// get program
// get trainee program
const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;

export async function fetchPrograms({
  PageNumber = 1,
  PageSize = 10,
  IsActive = true,
  IsDeleted = false,
  SearchTerm,
  MinDurationHours,
  MaxDurationHours,
} = {}) {
  const q = new URLSearchParams({
    PageNumber: String(PageNumber),
    PageSize: String(PageSize),
    IsActive: String(IsActive),
    IsDeleted: String(IsDeleted),
  });
  if (SearchTerm) q.append('SearchTerm', SearchTerm);
  if (MinDurationHours != null) q.append('MinDurationHours', String(MinDurationHours));
  if (MaxDurationHours != null) q.append('MaxDurationHours', String(MaxDurationHours));

  const response = await fetch(`${API_BASE_URL}/Programs?${q.toString()}`);
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
