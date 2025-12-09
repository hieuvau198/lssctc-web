// src/app/apis/Instructor/InstructorDashboard.js

import apiClient from '../../libs/axios';

/**
 * Get instructor overview summary with total counts
 * @param {string|number} instructorId - The instructor ID
 * @returns {Promise<Object>} Summary data with total counts
 */
export const getInstructorSummary = async (instructorId) => {
  try {
    const response = await apiClient.get(`/instructor/dashboard/summary`);
    return response.data?.data || null;
  } catch (error) {
    console.error('Error fetching instructor summary:', error);
    throw error;
  }
};

/**
 * Get top N classes by trainee count for a specific instructor
 * @param {string|number} instructorId - The instructor ID
 * @param {number} top - Number of top classes to return (default: 5)
 * @returns {Promise<Array>} Top classes by trainee count
 */
export const getTopClassesByTrainees = async (instructorId, top = 5) => {
  try {
    const response = await apiClient.get(`/instructor/dashboard/classes/top-by-trainees`, {
      params: { top },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching top classes by trainees:', error);
    throw error;
  }
};

/**
 * Get class status distribution for a specific instructor
 * @param {string|number} instructorId - The instructor ID
 * @returns {Promise<Array>} Class status distribution data
 */
export const getClassStatusDistribution = async (instructorId) => {
  try {
    const response = await apiClient.get(`/instructor/dashboard/classes/status-distribution`);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching class status distribution:', error);
    throw error;
  }
};

/**
 * Get yearly course completion trends for a specific instructor
 * @param {string|number} instructorId - The instructor ID
 * @param {number} year - The year to get trends for (optional, defaults to current year)
 * @returns {Promise<Array>} Yearly completion trends data
 */
export const getYearlyCompletionTrends = async (instructorId, year) => {
  try {
    const params = year ? { year } : {};
    const response = await apiClient.get(`/instructor/dashboard/completions/trends/yearly`, {
      params,
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching yearly completion trends:', error);
    throw error;
  }
};

/**
 * Get class grade distribution for a specific instructor (Pie Chart)
 * @param {string|number} instructorId - The instructor ID
 * @returns {Promise<Array>} Grade distribution data for pie chart
 */
export const getClassGradeDistribution = async (instructorId) => {
  try {
    const response = await apiClient.get(`/instructor/dashboard/classes/grade-distribution`);
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching class grade distribution:', error);
    throw error;
  }
};
