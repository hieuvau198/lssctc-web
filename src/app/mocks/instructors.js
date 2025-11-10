// Mock instructors and users
export const mockUsers = [
  {
    id: 1,
    username: 'jdoe',
    email: 'john.doe@example.com',
    fullname: 'John Doe',
    role: 'Instructor',
    phone_number: '+1-555-0101',
    avatar_url: null,
    is_active: true,
    is_deleted: false,
  },
  {
    id: 2,
    username: 'asmith',
    email: 'anna.smith@example.com',
    fullname: 'Anna Smith',
    role: 'Instructor',
    phone_number: '+1-555-0202',
    avatar_url: null,
    is_active: true,
    is_deleted: false,
  },
];

export const mockInstructors = [
  {
    id: 1,
    instructor_code: 'INST-001',
    hire_date: '2020-05-10',
    is_active: true,
    is_deleted: false,
    userId: 1,
  },
  {
    id: 2,
    instructor_code: 'INST-002',
    hire_date: '2022-02-14',
    is_active: true,
    is_deleted: false,
    userId: 2,
  },
];

export function getInstructorById(id) {
  const instr = mockInstructors.find((i) => i.id === Number(id));
  if (!instr) return null;
  const user = mockUsers.find((u) => u.id === Number(instr.userId));
  return { ...instr, user };
}

export default {
  mockUsers,
  mockInstructors,
  getInstructorById,
};
