export const ENROLLMENT_STATUS = {
  1: { key: 'Pending', label: 'Pending', color: 'gold' },
  2: { key: 'Enrolled', label: 'Enrolled', color: 'blue' },
  3: { key: 'Inprogress', label: 'Đang học', color: 'orange' },
  4: { key: 'Cancelled', label: 'Cancelled', color: 'red' },
  5: { key: 'Rejected', label: 'Rejected', color: 'red' },
  6: { key: 'Completed', label: 'Completed', color: 'green' },
  7: { key: 'Failed', label: 'Failed', color: 'volcano' },
  Pending: { key: 'Pending', label: 'Pending', color: 'gold' },
  Enrolled: { key: 'Enrolled', label: 'Enrolled', color: 'blue' },
  Inprogress: { key: 'Inprogress', label: 'Đang học', color: 'orange' },
  Cancelled: { key: 'Cancelled', label: 'Cancelled', color: 'red' },
  Rejected: { key: 'Rejected', label: 'Rejected', color: 'red' },
  Completed: { key: 'Completed', label: 'Completed', color: 'green' },
  Failed: { key: 'Failed', label: 'Failed', color: 'volcano' },
};

export function getEnrollmentStatus(status) {
  if (status == null) return { key: 'Unknown', label: '-', color: 'default' };
  const n = Number(status);
  if (!Number.isNaN(n) && ENROLLMENT_STATUS[n]) return ENROLLMENT_STATUS[n];
  const s = String(status);
  return ENROLLMENT_STATUS[s] || { key: s, label: s, color: 'default' };
}

export default getEnrollmentStatus;
