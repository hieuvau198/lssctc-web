// Mock data for Final Exam (TE/SE/PE) and associated partials
// Designed for quick UI testing in instructor Final Exam pages

export const mockFinalExams = [
  {
    id: 'fe-1',
    classId: 'class-1',
    name: 'Theory Exam - Batch A',
    type: 'TE',
    totalQuestions: 40,
    duration: 60, // minutes
    passingScore: 7.0,
    status: 'Active',
    examCode: 'TE-CLASS1-001',
    startDate: '2025-12-10T09:00:00.000Z',
    endDate: '2025-12-10T11:00:00.000Z',
  },
  {
    id: 'fe-2',
    classId: 'class-1',
    name: 'Simulation Exam - Batch A',
    type: 'SE',
    totalQuestions: 10,
    duration: 45,
    passingScore: 6.0,
    status: 'Active',
    examCode: 'SE-CLASS1-001',
    startDate: '2025-12-11T09:00:00.000Z',
    endDate: '2025-12-11T10:00:00.000Z',
  },
  {
    id: 'fe-3',
    classId: 'class-1',
    name: 'Practical Exam - Batch A',
    type: 'PE',
    totalTasks: 6,
    duration: 90,
    passingScore: 7.5,
    status: 'Active',
    examCode: 'PE-CLASS1-001',
    startDate: '2025-12-12T08:00:00.000Z',
    endDate: '2025-12-12T11:00:00.000Z',
  },
];

// Partial exam results per student (FinalExamPartial)
// Useful for Practical exam checklist rendering and grading
export const mockFinalExamPartials = [
  {
    id: 'partial-1',
    finalExamId: 'fe-1',
    enrollmentId: 'enr-1001',
    studentId: 'stu-1001',
    studentName: 'Nguyen Van A',
    type: 'TE',
    status: 'Submitted',
    score: 8.5,
    passFail: 'Pass',
    quizId: 'quiz-501',
    description: null,
    submittedAt: '2025-12-10T10:05:00.000Z'
  },
  {
    id: 'partial-2',
    finalExamId: 'fe-1',
    enrollmentId: 'enr-1002',
    studentId: 'stu-1002',
    studentName: 'Tran Thi B',
    type: 'TE',
    status: 'Submitted',
    score: 6.0,
    passFail: 'Fail',
    quizId: 'quiz-502',
    description: null,
    submittedAt: '2025-12-10T10:08:00.000Z'
  },
  {
    id: 'partial-3',
    finalExamId: 'fe-2',
    enrollmentId: 'enr-1001',
    studentId: 'stu-1001',
    studentName: 'Nguyen Van A',
    type: 'SE',
    status: 'Approved',
    score: 9.0,
    passFail: 'Pass',
    quizId: null,
    description: '{"notes":"Good handling of scenario 1","actions":[]}',
    submittedAt: '2025-12-11T09:55:00.000Z'
  },
  {
    id: 'partial-4',
    finalExamId: 'fe-3',
    enrollmentId: 'enr-1002',
    studentId: 'stu-1002',
    studentName: 'Tran Thi B',
    type: 'PE',
    status: 'Submitted',
    score: null,
    passFail: null,
    quizId: null,
    // description stores a checklist JSON for PE
    description: JSON.stringify({
      items: [
        { id: 't1', text: 'Pre-start checks', pass: true },
        { id: 't2', text: 'Engine start procedure', pass: true },
        { id: 't3', text: 'Lift operation', pass: false },
        { id: 't4', text: 'Emergency stop', pass: true },
        { id: 't5', text: 'Shutdown procedure', pass: true },
        { id: 't6', text: 'Post-inspection', pass: false }
      ],
      notes: 'Student missed task 3 and 6. Needs remediation.'
    }),
    submittedAt: '2025-12-12T09:30:00.000Z'
  },
  {
    id: 'partial-5',
    finalExamId: 'fe-3',
    enrollmentId: 'enr-1003',
    studentId: 'stu-1003',
    studentName: 'Le Van C',
    type: 'PE',
    status: 'Approved',
    score: 8.0,
    passFail: 'Pass',
    quizId: null,
    description: JSON.stringify({
      items: [
        { id: 't1', text: 'Pre-start checks', pass: true },
        { id: 't2', text: 'Engine start procedure', pass: true },
        { id: 't3', text: 'Lift operation', pass: true },
        { id: 't4', text: 'Emergency stop', pass: true },
        { id: 't5', text: 'Shutdown procedure', pass: true },
        { id: 't6', text: 'Post-inspection', pass: true }
      ],
      notes: 'Solid performance.'
    }),
    submittedAt: '2025-12-12T10:45:00.000Z'
  }
];

// Helper: map final exams + partials for a class
export function getMockExamsByClass(classId) {
  return mockFinalExams.filter(e => e.classId === classId);
}

export function getMockPartialsByFinalExam(finalExamId) {
  return mockFinalExamPartials.filter(p => p.finalExamId === finalExamId);
}

export default {
  mockFinalExams,
  mockFinalExamPartials,
  getMockExamsByClass,
  getMockPartialsByFinalExam,
};
