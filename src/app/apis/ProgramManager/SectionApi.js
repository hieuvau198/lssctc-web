// src/app/apis/ProgramManager/SectionApi.js
import apiClient from '../../libs/axios';

// Assumes VITE_API_Program_Service_URL points to '.../api'
const BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Sections`;

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
      `${BASE_URL}/course/${courseId}/import`, 
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