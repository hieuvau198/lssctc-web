import { useState, useEffect } from 'react';
import { fetchClassesByCourse } from '../../apis/ProgramManager/ClassApi';

/**
 * Custom hook to fetch classes by course ID
 * @param {string|number} courseId - The course ID to fetch classes for
 * @returns {Object} { classes, loading, error, refetch }
 */
export function useClassesByCourse(courseId) {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClasses = async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchClassesByCourse(courseId);
      setClasses(result || []);
    } catch (err) {
      setError(err.message || 'Failed to load classes');
      setClasses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [courseId]);

  return {
    classes,
    loading,
    error,
    refetch: fetchClasses,
  };
}
