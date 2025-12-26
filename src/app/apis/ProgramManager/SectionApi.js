// src/app/apis/ProgramManager/SectionApi.js
import apiClient from '../../libs/axios';

// Assumes VITE_API_Program_Service_URL points to '.../api'
const BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Sections`;

//#region  Section APIs
/**
 * Fetch all sections assigned to a specific course
 */
export async function fetchSectionsByCourse(courseId) {
  try {
    const resp = await apiClient.get(`${BASE_URL}/course/${courseId}`);
    return resp.data;
  } catch (err) {
    console.error('Error fetching course sections:', err);
    throw err;
  }
}

/**
 * Create a new section (independent of a course)
 */
export async function createSection(sectionData) {
  try {
    const resp = await apiClient.post(BASE_URL, sectionData);
    return resp.data;
  } catch (err) {
    console.error('Error creating section:', err);
    throw err;
  }
}

/**
 * Create a new section and assign it to a course immediately
 */
export async function createSectionForCourse(courseId, sectionData) {
  try {
    const resp = await apiClient.post(`${BASE_URL}/course/${courseId}`, sectionData);
    return resp.data;
  } catch (err) {
    console.error('Error creating section for course:', err);
    throw err;
  }
}

/**
 * Update an existing section
 */
export async function updateSection(sectionId, sectionData) {
  try {
    const resp = await apiClient.put(`${BASE_URL}/${sectionId}`, sectionData);
    return resp.data;
  } catch (err) {
    console.error('Error updating section:', err);
    throw err;
  }
}

/**
 * Assign an existing section to a course
 */
export async function addSectionToCourse(courseId, sectionId) {
  try {
    const resp = await apiClient.post(`${BASE_URL}/course/${courseId}/section/${sectionId}`);
    return resp.data;
  } catch (err) {
    console.error('Error assigning section to course:', err);
    throw err;
  }
}

/**
 * Remove a section from a course
 */
export async function removeSectionFromCourse(courseId, sectionId) {
  try {
    await apiClient.delete(`${BASE_URL}/course/${courseId}/section/${sectionId}`);
    return true;
  } catch (err) {
    console.error('Error removing section from course:', err);
    throw err;
  }
}

/**
 * Import sections from an Excel file and auto-assign to course
 */
export async function importSections(courseId, file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const resp = await apiClient.post(
      `${BASE_URL}/course/${courseId}/import-full`, 
      formData, 
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return resp.data;
  } catch (err) {
    console.error('Error importing sections:', err);
    throw err;
  }
}

/**
 * Update section order (Optional, if you want to implement drag & drop reordering later)
 */
export async function updateSectionOrder(courseId, sectionId, newOrder) {
  try {
    const resp = await apiClient.put(`${BASE_URL}/course/${courseId}/section/${sectionId}/order/${newOrder}`);
    return resp.data;
  } catch (err) {
    console.error('Error updating section order:', err);
    throw err;
  }
}
//#endregion


//#region Activity APIs
/**
 * Fetch all activities for a specific section
 */
export async function fetchActivitiesBySection(sectionId) {
  try {
    const resp = await apiClient.get(`/Activities/section/${sectionId}`);
    return resp.data;
  } catch (err) {
    console.error(`Error fetching activities for section ${sectionId}:`, err);
    throw err;
  }
}

/**
 * Create a new activity and assign it to a section
 */
export async function createActivity(sectionId, activityData) {
  try {
    const resp = await apiClient.post(`/Activities/section/${sectionId}/activity/create`, activityData);
    return resp.data;
  } catch (err) {
    console.error('Error creating activity:', err);
    throw err;
  }
}

/**
 * Update an existing activity
 */
export async function updateActivity(activityId, activityData) {
  try {
    const resp = await apiClient.put(`/Activities/${activityId}`, activityData);
    return resp.data;
  } catch (err) {
    console.error('Error updating activity:', err);
    throw err;
  }
}

/**
 * Delete an activity
 */
export async function deleteActivity(activityId) {
  try {
    await apiClient.delete(`/Activities/${activityId}`);
    return true;
  } catch (err) {
    console.error('Error deleting activity:', err);
    throw err;
  }
}

/**
 * Remove an activity from a section (dissociate)
 */
export async function removeActivityFromSection(sectionId, activityId) {
  try {
    await apiClient.delete(`/Activities/section/${sectionId}/activity/${activityId}`);
    return true;
  } catch (err) {
    console.error(`Error removing activity ${activityId} from section ${sectionId}:`, err);
    throw err;
  }
}

//#endregion

//#region Activity-Quiz APIs

/**
 * Fetch all available quizzes (for dropdown)
 */
export async function fetchAllQuizzes() {
  try {
    const resp = await apiClient.get('/Quizzes?pageIndex=1&pageSize=50');
    // Handle wrapped response { data: { items: [] } } or direct { items: [] }
    const data = resp.data?.data || resp.data;
    return data?.items || [];
  } catch (err) {
    console.error('Error fetching all quizzes:', err);
    return [];
  }
}

/**
 * Fetch quizzes assigned to a specific activity
 */
export async function fetchQuizzesByActivity(activityId) {
  try {
    const resp = await apiClient.get(`/Quizzes/activity/${activityId}/quizzes`);
    // Handle wrapped response { status, message, data: [] }
    return resp.data?.data || resp.data || [];
  } catch (err) {
    console.error(`Error fetching quizzes for activity ${activityId}:`, err);
    return [];
  }
}

/**
 * Assign a quiz to an activity
 */
export async function assignQuizToActivity(activityId, quizId) {
  try {
    const resp = await apiClient.post(`/Quizzes/add-to-activity`, {
      activityId,
      quizId
    });
    return resp.data;
  } catch (err) {
    console.error(`Error assigning quiz ${quizId} to activity ${activityId}:`, err);
    throw err;
  }
}

/**
 * Remove a quiz from an activity
 */
export async function removeQuizFromActivity(activityId, quizId) {
  try {
    await apiClient.delete(`/Quizzes/activity/${activityId}/quiz/${quizId}`);
    return true;
  } catch (err) {
    console.error(`Error removing quiz ${quizId} from activity ${activityId}:`, err);
    throw err;
  }
}

//#endregion

//#region Activity-Practice APIs

/**
 * Fetch all available practices (for dropdown)
 */
export async function fetchAllPractices() {
  try {
    // Calling GetAll endpoint (not paged, or large page size)
    const resp = await apiClient.get('/Practices/paged?pageNumber=1&pageSize=50');
    const data = resp.data?.data || resp.data;
    return data?.items || [];
  } catch (err) {
    console.error('Error fetching all practices:', err);
    return [];
  }
}

/**
 * Fetch practices assigned to a specific activity
 */
export async function fetchPracticesByActivity(activityId) {
  try {
    const resp = await apiClient.get(`/Practices/activity/${activityId}`);
    // Handle wrapped response { success: true, data: [...] }
    return resp.data?.data || resp.data || [];
  } catch (err) {
    console.error(`Error fetching practices for activity ${activityId}:`, err);
    return [];
  }
}

/**
 * Assign a practice to an activity
 */
export async function assignPracticeToActivity(activityId, practiceId) {
  try {
    const resp = await apiClient.post(`/Practices/activity/${activityId}/add/${practiceId}`);
    return resp.data;
  } catch (err) {
    console.error(`Error assigning practice ${practiceId} to activity ${activityId}:`, err);
    throw err;
  }
}

/**
 * Remove a practice from an activity
 */
export async function removePracticeFromActivity(activityId, practiceId) {
  try {
    await apiClient.delete(`/Practices/activity/${activityId}/remove/${practiceId}`);
    return true;
  } catch (err) {
    console.error(`Error removing practice ${practiceId} from activity ${activityId}:`, err);
    throw err;
  }
}

//#endregion