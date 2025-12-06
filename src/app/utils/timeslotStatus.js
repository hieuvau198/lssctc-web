export const TIMESLOT_STATUS = {
  1: { key: 'NotStarted', label: 'Not Started', color: 'default' },
  2: { key: 'Ongoing', label: 'Ongoing', color: 'orange' },
  3: { key: 'Completed', label: 'Completed', color: 'green' },
  4: { key: 'Cancelled', label: 'Cancelled', color: 'red' },
  NotStarted: { key: 'NotStarted', label: 'Not Started', color: 'default' },
  Ongoing: { key: 'Ongoing', label: 'Ongoing', color: 'orange' },
  Completed: { key: 'Completed', label: 'Completed', color: 'green' },
  Cancelled: { key: 'Cancelled', label: 'Cancelled', color: 'red' },
};

export const ATTENDANCE_STATUS = {
  1: { key: 'NotStarted', label: 'Not Started', color: 'default' },
  2: { key: 'Present', label: 'Present', color: 'green' },
  3: { key: 'Absent', label: 'Absent', color: 'red' },
  4: { key: 'Cancelled', label: 'Cancelled', color: 'red' },
  NotStarted: { key: 'NotStarted', label: 'Not Started', color: 'default' },
  Present: { key: 'Present', label: 'Present', color: 'green' },
  Absent: { key: 'Absent', label: 'Absent', color: 'red' },
  Cancelled: { key: 'Cancelled', label: 'Cancelled', color: 'red' },
};

function normalizeInput(value) {
  if (value == null) return null;
  // numeric strings or numbers -> number
  const n = Number(value);
  if (!Number.isNaN(n)) return n;
  // otherwise return trimmed string
  return String(value).trim();
}

export function getTimeslotStatus(status) {
  if (status == null) return { key: 'Unknown', label: '-', color: 'default' };
  const v = normalizeInput(status);
  if (typeof v === 'number' && TIMESLOT_STATUS[v]) return TIMESLOT_STATUS[v];
  const s = String(v);
  return TIMESLOT_STATUS[s] || { key: s, label: s, color: 'default' };
}

export function getAttendanceStatus(status) {
  if (status == null) return { key: 'Unknown', label: '-', color: 'default' };
  const v = normalizeInput(status);
  if (typeof v === 'number' && ATTENDANCE_STATUS[v]) return ATTENDANCE_STATUS[v];
  const s = String(v);
  return ATTENDANCE_STATUS[s] || { key: s, label: s, color: 'default' };
}

export default getTimeslotStatus;
