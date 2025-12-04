// src/app/contexts/LearningSidebarContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const LearningSidebarContext = createContext(null);

export function LearningSidebarProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [courseTitle, setCourseTitle] = useState('');

  // Function to trigger sidebar refresh
  const refreshSidebar = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  // Function to show course completion celebration
  const triggerCourseCompletion = useCallback((title) => {
    setCourseTitle(title);
    setShowCompletionModal(true);
  }, []);

  // Function to close completion modal
  const closeCompletionModal = useCallback(() => {
    setShowCompletionModal(false);
  }, []);

  return (
    <LearningSidebarContext.Provider value={{ 
      refreshKey, 
      refreshSidebar,
      showCompletionModal,
      courseTitle,
      triggerCourseCompletion,
      closeCompletionModal
    }}>
      {children}
    </LearningSidebarContext.Provider>
  );
}

export function useLearningSidebar() {
  const context = useContext(LearningSidebarContext);
  if (!context) {
    // Return a no-op if not within provider (for safety)
    return { 
      refreshKey: 0, 
      refreshSidebar: () => {},
      showCompletionModal: false,
      courseTitle: '',
      triggerCourseCompletion: () => {},
      closeCompletionModal: () => {}
    };
  }
  return context;
}

export default LearningSidebarContext;
