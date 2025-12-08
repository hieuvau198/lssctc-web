import { useState, useEffect, useCallback } from 'react';
import * as FinalExamApi from '../../apis/FinalExam/FinalExamApi';
import * as MockFinalExamApi from '../../apis/FinalExam/mockFinalExamApi';

/**
 * Custom hook for managing Final Exams in a class
 * @param {string|number} classId - The class ID
 * @returns {Object} - Final exam data and methods
 */
export function useFinalExams(classId) {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Choose API: use mock in dev or when VITE_USE_MOCK is true
  const api = (import.meta.env && (import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.MODE === 'development'))
    ? MockFinalExamApi
    : FinalExamApi;

  // Load all final exams for the class
  const loadExams = useCallback(async () => {
    if (!classId) return;

    try {
      setLoading(true);
      setError(null);
      const data = await api.getFinalExamsByClass(classId);
      setExams(data || []);
    } catch (err) {
      console.error('Failed to load final exams:', err);
      setError(err.message || 'Failed to load exams');
      setExams([]);
    } finally {
      setLoading(false);
    }
  }, [classId, api]);

  // Create a new final exam
  const createExam = useCallback(async (payload) => {
    try {
      setLoading(true);
      const newExam = await api.createFinalExam(payload);
      await loadExams(); // Reload to get updated list
      return newExam;
    } catch (err) {
      console.error('Failed to create exam:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadExams, api]);

  // Update an existing final exam
  const updateExam = useCallback(async (id, payload) => {
    try {
      setLoading(true);
      const updatedExam = await api.updateFinalExam(id, payload);
      await loadExams(); // Reload to get updated list
      return updatedExam;
    } catch (err) {
      console.error('Failed to update exam:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadExams, api]);

  // Delete a final exam
  const deleteExam = useCallback(async (id) => {
    try {
      setLoading(true);
      await api.deleteFinalExam(id);
      await loadExams(); // Reload to get updated list
    } catch (err) {
      console.error('Failed to delete exam:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [loadExams, api]);

  // Load exams when classId changes
  useEffect(() => {
    loadExams();
  }, [loadExams]);

  return {
    exams,
    loading,
    error,
    loadExams,
    createExam,
    updateExam,
    deleteExam,
  };
}
