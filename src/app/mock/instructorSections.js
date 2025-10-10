// Mock data for instructor sections
export const mockSections = [
  {
    id: 1,
    name: "Truck-mounted Crane Overview",
    description:
      "This section introduces the various categories and types of cranes, with a specific focus on defining what a truck-mounted crane is. It typically concludes with a quiz (Test 1) to check foundational knowledge.",
    classesId: 3,
    syllabusSectionId: 1,
    order: 1,
    status: 1,
    durationMinutes: 300,
    programCourseId: 3,
  },
  {
    id: 2,
    name: "Safety Fundamentals",
    description: "Core safety rules, PPE, and risk assessment for crane operations.",
    classesId: 1,
    syllabusSectionId: 2,
    order: 2,
    status: 1,
    durationMinutes: 180,
    programCourseId: 1,
  },
  {
    id: 3,
    name: "Load Charts & Calculations",
    description: "Reading load charts, determining safe working loads, and stability.",
    classesId: 2,
    syllabusSectionId: 3,
    order: 3,
    status: 1,
    durationMinutes: 240,
    programCourseId: 2,
  },
  {
    id: 4,
    name: "Rigging Basics",
    description: "Slings, shackles, and rigging best practices for safe lifts.",
    classesId: 4,
    syllabusSectionId: 4,
    order: 4,
    status: 0,
    durationMinutes: 150,
    programCourseId: 1,
  },
  {
    id: 5,
    name: "Inspection & Maintenance",
    description: "Daily, weekly, and monthly inspection routines; reporting defects.",
    classesId: 1,
    syllabusSectionId: 5,
    order: 5,
    status: 1,
    durationMinutes: 120,
    programCourseId: 1,
  },
  {
    id: 6,
    name: "Communication & Signals",
    description: "Standard hand signals and radio communication protocols.",
    classesId: 3,
    syllabusSectionId: 6,
    order: 6,
    status: 1,
    durationMinutes: 90,
    programCourseId: 3,
  },
  {
    id: 7,
    name: "Operational Controls",
    description: "Hands-on controls familiarization and simulator introduction.",
    classesId: 2,
    syllabusSectionId: 7,
    order: 7,
    status: 1,
    durationMinutes: 210,
    programCourseId: 2,
  },
  {
    id: 8,
    name: "Emergency Procedures",
    description: "Emergency stops, power loss, and evacuation procedures.",
    classesId: 4,
    syllabusSectionId: 8,
    order: 8,
    status: 0,
    durationMinutes: 75,
    programCourseId: 1,
  },
];

export const getInstructorSections = (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let result = [...mockSections];

      const { searchTerm, status } = filters;
      if (searchTerm) {
        const s = String(searchTerm).toLowerCase();
        result = result.filter(
          (x) =>
            x.name.toLowerCase().includes(s) ||
            x.description.toLowerCase().includes(s) ||
            String(x.classesId).includes(s) ||
            String(x.syllabusSectionId).includes(s)
        );
      }

      if (status !== undefined && status !== null && status !== "") {
        result = result.filter((x) => String(x.status) === String(status));
      }

      const pageNumber = Number(filters.pageNumber || 1);
      const pageSize = Number(filters.pageSize || 12);
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;

      const paginated = result.slice(startIndex, endIndex);
      resolve({ items: paginated, totalCount: result.length });
    }, 400);
  });
};
