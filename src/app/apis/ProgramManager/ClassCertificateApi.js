// src/app/apis/ProgramManager/ClassCertificateApi.js
import apiClient from '../../libs/axios';

const CERT_BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/Certificates`;
const TRAINEE_CERT_BASE_URL = `${import.meta.env.VITE_API_Program_Service_URL}/TraineeCertificates`;

/**
 * Fetches the certificate template assigned to the class's course.
 */
export async function fetchCertificateByClass(classId) {
  try {
    const response = await apiClient.get(`${CERT_BASE_URL}/class/${classId}`);
    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 404) {
      return null;
    }
    console.error(`Error fetching certificate for class ${classId}:`, err);
    throw err;
  }
}

/**
 * Fetches the list of certificates issued to trainees in this class.
 * Assumes endpoint: GET /api/TraineeCertificates/class/{classId}
 */
export async function fetchTraineeCertificatesByClass(classId) {
  try {
    const response = await apiClient.get(`${TRAINEE_CERT_BASE_URL}/class/${classId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (err) {
    console.error(`Error fetching trainee certificates for class ${classId}:`, err);
    return []; // Return empty array on error to prevent UI crash
  }
}