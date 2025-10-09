// Mock data for instructor classes
export const mockClasses = [
  {
    id: 1,
    name: "Basic Crane Operation",
    startDate: "2025-09-26T14:46:42",
    endDate: "2025-12-26T14:46:42",
    capacity: 30,
    programCourseId: 1,
    classCode: {
      id: 6,
      name: "CL00001"
    },
    description: "Basic crane operation course for beginners",
    status: "1",
    imageUrl: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400"
  },
  {
    id: 2,
    name: "Advanced Crane Techniques",
    startDate: "2025-10-01T09:00:00",
    endDate: "2025-12-30T17:00:00",
    capacity: 25,
    programCourseId: 2,
    classCode: {
      id: 7,
      name: "CL00002"
    },
    description: "Advanced crane operation techniques and safety protocols",
    status: "1",
    imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400"
  },
  {
    id: 3,
    name: "Safety Protocols Training",
    startDate: "2025-08-15T08:30:00",
    endDate: "2025-11-15T16:30:00",
    capacity: 20,
    programCourseId: 3,
    classCode: {
      id: 8,
      name: "CL00003"
    },
    description: "Safety protocols and regulations for crane operators",
    status: "0",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400"
  },
  {
    id: 4,
    name: "Heavy Machinery Operations",
    startDate: "2025-11-01T10:00:00",
    endDate: "2026-02-28T18:00:00",
    capacity: 35,
    programCourseId: 1,
    classCode: {
      id: 9,
      name: "CL00004"
    },
    description: "Comprehensive heavy machinery operations training",
    status: "1",
    imageUrl: "https://images.unsplash.com/photo-1572342154127-827364973958?w=400"
  }
];

// Mock programs/courses data
export const mockPrograms = {
  1: "Crane Operation Fundamentals",
  2: "Advanced Crane Techniques", 
  3: "Safety and Compliance Training"
};

// API functions
export const getInstructorClasses = (filters = {}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredClasses = [...mockClasses];
      
      // Filter by search term
      if (filters.searchTerm) {
        filteredClasses = filteredClasses.filter(item => 
          item.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          item.classCode.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(filters.searchTerm.toLowerCase())
        );
      }
      
      // Filter by status
      if (filters.status !== undefined) {
        filteredClasses = filteredClasses.filter(item => item.status === filters.status);
      }
      
      // Pagination
      const pageNumber = filters.pageNumber || 1;
      const pageSize = filters.pageSize || 12;
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      const paginatedData = filteredClasses.slice(startIndex, endIndex);
      
      resolve({
        items: paginatedData,
        totalCount: filteredClasses.length
      });
    }, 500);
  });
};

export const getClassById = (id) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const classData = mockClasses.find(c => c.id === parseInt(id));
      resolve(classData);
    }, 300);
  });
};

export const getProgramName = (programCourseId) => {
  return mockPrograms[programCourseId] || "Unknown Program";
};