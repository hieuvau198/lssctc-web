// src/app/apis/Admin/AdminDashboard.js

import apiClient from '../../libs/axios';

/**
 * Get system overview summary with total counts
 * @returns {Promise<{totalPrograms, totalCourses, totalTrainees, totalInstructors, totalClasses, totalPractices}>}
 */
export const getSystemSummary = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard/summary');
    return response.data?.data || null;
  } catch (error) {
    console.error('Error fetching system summary:', error);
    throw error;
  }
};

/**
 * Get top N most popular courses based on enrollment count
 * @param {number} top - Number of top courses to return (default: 5)
 * @returns {Promise<Array<{courseName, totalEnrollments}>>}
 */
export const getPopularCourses = async (top = 5) => {
  try {
    const response = await apiClient.get('/admin/dashboard/courses/popular', {
      params: { top },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching popular courses:', error);
    throw error;
  }
};

/**
 * Get top N most active trainees based on number of enrolled courses
 * @param {number} top - Number of top trainees to return (default: 5)
 * @returns {Promise<Array<{traineeName, traineeCode, enrolledCourseCount}>>}
 */
export const getActiveTrainees = async (top = 5) => {
  try {
    const response = await apiClient.get('/admin/dashboard/trainees/active', {
      params: { top },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching active trainees:', error);
    throw error;
  }
};

/**
 * Get class status distribution (count of classes by status)
 * @returns {Promise<Array<{statusName, count}>>}
 */
export const getClassStatusDistribution = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard/classes/status-distribution');
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching class status distribution:', error);
    throw error;
  }
};

/**
 * Get daily course completion trends for a specific month and year
 * @param {number} month - Month (1-12)
 * @param {number} year - Year (e.g., 2025)
 * @returns {Promise<Array<{day, completedCount}>>}
 */
export const getDailyCompletionTrends = async (month, year) => {
  try {
    const response = await apiClient.get('/admin/dashboard/completions/trends/daily', {
      params: { month, year },
    });
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching daily completion trends:', error);
    throw error;
  }
};
