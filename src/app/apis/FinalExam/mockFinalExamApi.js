import {
  mockFinalExams as _mockFinalExams,
  mockFinalExamPartials as _mockFinalExamPartials,
  getMockExamsByClass,
} from '../../mocks/finalExams';

// Work on in-memory copies so tests can create/update/delete without touching original exports
const exams = Array.isArray(_mockFinalExams) ? [..._mockFinalExams] : [];
const partials = Array.isArray(_mockFinalExamPartials) ? [..._mockFinalExamPartials] : [];

function simulateLatency(result, ms = 250) {
  return new Promise((resolve) => setTimeout(() => resolve(result), ms));
}

export async function getFinalExamsByClass(classId) {
  const filtered = exams.filter((e) => e.classId === classId);
  // If no exams found for the requested classId, return a mapped copy
  // of the mock exams with their classId set to the requested one so
  // UI can display sample data regardless of real classId.
  if (filtered.length === 0) {
    const mapped = exams.map((e) => ({ ...e, classId }));
    return simulateLatency(mapped);
  }
  return simulateLatency(filtered);
}

export async function getPartialsByFinalExam(finalExamId) {
  const filtered = partials.filter((p) => p.finalExamId === finalExamId);
  return simulateLatency(filtered);
}

export async function getFinalExamById(id) {
  const found = exams.find((e) => e.id === id) || null;
  return simulateLatency(found);
}

export async function createFinalExam(payload) {
  const id = `fe-${Date.now()}`;
  const newExam = {
    id,
    ...payload,
  };
  exams.push(newExam);
  return simulateLatency(newExam);
}

export async function updateFinalExam(id, payload) {
  const idx = exams.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('Exam not found');
  exams[idx] = { ...exams[idx], ...payload };
  return simulateLatency(exams[idx]);
}

export async function deleteFinalExam(id) {
  const idx = exams.findIndex((e) => e.id === id);
  if (idx === -1) throw new Error('Exam not found');
  exams.splice(idx, 1);
  return simulateLatency({ success: true });
}

export async function generateExamCode(classId, type = 'GEN') {
  const code = `${type}-${classId}-${Date.now().toString().slice(-4)}`;
  return simulateLatency({ code });
}

export default {
  getFinalExamsByClass,
  getFinalExamById,
  createFinalExam,
  updateFinalExam,
  deleteFinalExam,
  generateExamCode,
};
