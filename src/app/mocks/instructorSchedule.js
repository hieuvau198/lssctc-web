/**
 * Mock data for Instructor Schedule
 * Slots represent time periods in a day
 * Schedule shows which class is assigned to which slot on which day
 */

// Define time slots (periods in a day)
export const mockTimeSlots = [
  { id: 1, name: 'Slot 1', startTime: '07:00', endTime: '09:00' },
  { id: 2, name: 'Slot 2', startTime: '09:15', endTime: '11:15' },
  { id: 3, name: 'Slot 3', startTime: '13:00', endTime: '15:00' },
  { id: 4, name: 'Slot 4', startTime: '15:15', endTime: '17:15' },
  { id: 5, name: 'Slot 5', startTime: '18:00', endTime: '20:00' },
];

// Days of week (Monday to Sunday)
export const weekDays = [
  { key: 'monday', label: 'Thứ 2', labelEn: 'Monday' },
  { key: 'tuesday', label: 'Thứ 3', labelEn: 'Tuesday' },
  { key: 'wednesday', label: 'Thứ 4', labelEn: 'Wednesday' },
  { key: 'thursday', label: 'Thứ 5', labelEn: 'Thursday' },
  { key: 'friday', label: 'Thứ 6', labelEn: 'Friday' },
  { key: 'saturday', label: 'Thứ 7', labelEn: 'Saturday' },
  { key: 'sunday', label: 'CN', labelEn: 'Sunday' },
];

// Mock schedule data - which class is in which slot on which day
// For the current week (Dec 2-8, 2025)
export const mockInstructorSchedule = [
  {
    id: 1,
    classId: 'CLS001',
    className: 'Vận hành cẩu trục cơ bản',
    classCode: 'CT-2024-001',
    courseCode: 'CRN-101',
    slotId: 1,
    dayOfWeek: 'monday',
    date: '2025-12-02',
    room: 'Phòng A1',
    status: 'Inprogress',
  },
  {
    id: 2,
    classId: 'CLS001',
    className: 'Vận hành cẩu trục cơ bản',
    classCode: 'CT-2024-001',
    courseCode: 'CRN-101',
    slotId: 2,
    dayOfWeek: 'monday',
    date: '2025-12-02',
    room: 'Phòng A1',
    status: 'Inprogress',
  },
  {
    id: 3,
    classId: 'CLS002',
    className: 'An toàn lao động',
    classCode: 'AT-2024-003',
    courseCode: 'SAF-201',
    slotId: 3,
    dayOfWeek: 'monday',
    date: '2025-12-02',
    room: 'Phòng B2',
    status: 'Open',
  },
  {
    id: 4,
    classId: 'CLS001',
    className: 'Vận hành cẩu trục cơ bản',
    classCode: 'CT-2024-001',
    courseCode: 'CRN-101',
    slotId: 1,
    dayOfWeek: 'wednesday',
    date: '2025-12-04',
    room: 'Phòng A1',
    status: 'Inprogress',
  },
  {
    id: 5,
    classId: 'CLS003',
    className: 'Thực hành mô phỏng',
    classCode: 'SIM-2024-005',
    courseCode: 'SIM-301',
    slotId: 4,
    dayOfWeek: 'wednesday',
    date: '2025-12-04',
    room: 'Phòng Mô phỏng',
    status: 'Inprogress',
  },
  {
    id: 6,
    classId: 'CLS002',
    className: 'An toàn lao động',
    classCode: 'AT-2024-003',
    courseCode: 'SAF-201',
    slotId: 2,
    dayOfWeek: 'thursday',
    date: '2025-12-05',
    room: 'Phòng B2',
    status: 'Open',
  },
  {
    id: 7,
    classId: 'CLS003',
    className: 'Thực hành mô phỏng',
    classCode: 'SIM-2024-005',
    courseCode: 'SIM-301',
    slotId: 3,
    dayOfWeek: 'friday',
    date: '2025-12-06',
    room: 'Phòng Mô phỏng',
    status: 'Inprogress',
  },
  {
    id: 8,
    classId: 'CLS003',
    className: 'Thực hành mô phỏng',
    classCode: 'SIM-2024-005',
    courseCode: 'SIM-301',
    slotId: 4,
    dayOfWeek: 'friday',
    date: '2025-12-06',
    room: 'Phòng Mô phỏng',
    status: 'Inprogress',
  },
  {
    id: 9,
    classId: 'CLS004',
    className: 'Kỹ thuật nâng cao',
    classCode: 'ADV-2024-002',
    courseCode: 'ADV-401',
    slotId: 1,
    dayOfWeek: 'saturday',
    date: '2025-12-07',
    room: 'Phòng C3',
    status: 'Completed',
  },
  {
    id: 10,
    classId: 'CLS005',
    className: 'Kiểm tra định kỳ',
    classCode: 'TEST-2024-010',
    courseCode: 'TST-501',
    slotId: 5,
    dayOfWeek: 'tuesday',
    date: '2025-12-03',
    room: 'Phòng Kiểm tra',
    status: 'Draft',
  },
];

/**
 * Get schedule for a specific week
 * @param {Date} weekStartDate - Start date of the week (Monday)
 * @returns {Array} Schedule items for that week
 */
export function getWeekSchedule(weekStartDate) {
  // In real implementation, this would filter by date range
  // For mock, we return all data
  return mockInstructorSchedule;
}

/**
 * Get schedule grouped by slot and day
 * Returns a map: { slotId: { dayOfWeek: scheduleItem } }
 */
export function getScheduleGrid() {
  const grid = {};
  
  mockTimeSlots.forEach(slot => {
    grid[slot.id] = {};
    weekDays.forEach(day => {
      grid[slot.id][day.key] = null;
    });
  });
  
  mockInstructorSchedule.forEach(item => {
    if (grid[item.slotId]) {
      grid[item.slotId][item.dayOfWeek] = item;
    }
  });
  
  return grid;
}

export default {
  mockTimeSlots,
  weekDays,
  mockInstructorSchedule,
  getWeekSchedule,
  getScheduleGrid,
};
