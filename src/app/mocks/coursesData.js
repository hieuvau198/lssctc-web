// Mock of course titles and metadata
export const coursesData = {
  '1': {
    title: 'Introduction to Truck Crane',
  },
  '2': {
    title: 'Safety Protocols and Risk Management',
  },
  '3': {
    title: 'Load Calculation and Chart Reading',
  },
  '4': {
    title: 'Equipment Maintenance and Inspection',
  }
};

export function getCourseTitle(courseId) {
  const entry = coursesData[String(courseId)];
  return entry?.title || 'Module Content';
}
