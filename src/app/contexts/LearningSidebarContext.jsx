// src/app/contexts/LearningSidebarContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const LearningSidebarContext = createContext(null);

export function LearningSidebarProvider({ children }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Function to trigger sidebar refresh
  const refreshSidebar = useCallback(() => {
    setRefreshKey(prev => prev + 1);
  }, []);

  return (
    <LearningSidebarContext.Provider value={{ refreshKey, refreshSidebar }}>
      {children}
    </LearningSidebarContext.Provider>
  );
}

export function useLearningSidebar() {
  const context = useContext(LearningSidebarContext);
  if (!context) {
    // Return a no-op if not within provider (for safety)
    return { refreshKey: 0, refreshSidebar: () => {} };
  }
  return context;
}

export default LearningSidebarContext;
