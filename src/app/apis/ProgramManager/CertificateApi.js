// src/app/apis/ProgramManager/CertificateApi.js
import apiClient from '../../libs/axios';

const BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Certificates`;

export async function fetchCertificateTemplates() {
  try {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  } catch (err) {
    console.error('Error fetching certificate templates:', err);
    throw err;
  }
}

export async function createCertificateTemplate(data) {
  const response = await apiClient.post(BASE_URL, data);
  return response.data;
}

export async function updateCertificateTemplate(id, data) {
  const response = await apiClient.put(`${BASE_URL}/${id}`, data);
  return response.data;
}

export async function fetchCertificateByCourse(courseId) {
  try {
    const response = await apiClient.get(`${BASE_URL}/course/${courseId}`);
    return response.data;
  } catch (err) {
    // Return null if 404 (Not Found) to handle "No certificate assigned" state gracefully
    if (err.response && err.response.status === 404) {
      return null;
    }
    console.error(`Error fetching certificate for course ${courseId}:`, err);
    throw err;
  }
}

export async function assignCertificateToCourse(courseId, certificateId) {
  try {
    const response = await apiClient.post(`${BASE_URL}/courses/${courseId}/assign/${certificateId}`);
    return response.data;
  } catch (err) {
    console.error('Error assigning certificate to course:', err);
    throw err;
  }
}

export async function autoAssignCertificateToCourse(courseId) {
  try {
    const response = await apiClient.post(`${BASE_URL}/courses/${courseId}/auto-assign`);
    return response.data;
  } catch (err) {
    console.error('Error auto-assigning certificate:', err);
    throw err;
  }
}