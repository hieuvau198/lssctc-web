export const CLASS_STATUS = {
  1: { key: 'Draft', label: 'Draft', color: 'default' },
  2: { key: 'Open', label: 'Open', color: 'blue' },
  3: { key: 'Inprogress', label: 'In Progress', color: 'orange' },
  4: { key: 'Completed', label: 'Completed', color: 'green' },
  5: { key: 'Cancelled', label: 'Cancelled', color: 'red' },
  Draft: { key: 'Draft', label: 'Draft', color: 'default' },
  Open: { key: 'Open', label: 'Open', color: 'blue' },
  Inprogress: { key: 'Inprogress', label: 'In Progress', color: 'orange' },
  Completed: { key: 'Completed', label: 'Completed', color: 'green' },
  Cancelled: { key: 'Cancelled', label: 'Cancelled', color: 'red' },
};

export function getClassStatus(status) {
  if (status == null) return { key: 'Unknown', label: '-', color: 'default' };
  // numeric or numeric string
  const n = Number(status);
  if (!Number.isNaN(n) && CLASS_STATUS[n]) return CLASS_STATUS[n];
  // string key
  const s = String(status);
  return CLASS_STATUS[s] || { key: s, label: s, color: 'default' };
}

export default getClassStatus;
