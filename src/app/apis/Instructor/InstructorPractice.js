import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_Simulation_Service_URL;
const BASE = `${API_BASE_URL}`;

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

const mapPracticeFromApi = (item) => ({
  id: item.id,
  practiceName: item.practiceName,
  practiceDescription: item.practiceDescription,
  estimatedDurationMinutes: item.estimatedDurationMinutes,
  difficultyLevel: item.difficultyLevel,
  maxAttempts: item.maxAttempts,
  createdDate: item.createdDate,
  isActive: item.isActive,
});

export async function getPractices({ page = 1, pageSize = 10 } = {}) {
  try {
    const qs = buildQuery({ page, pageSize });
    const { data } = await axios.get(`${BASE}/Practices${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };

    const items = Array.isArray(data.items) ? data.items.map(mapPracticeFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching practices:', err);
    throw err;
  }
}

export default {
  getPractices,
};