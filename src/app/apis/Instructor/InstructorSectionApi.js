import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_Program_Service_URL;
const BASE = `${API_BASE_URL}`;

function buildQuery(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

const mapLearningMaterial = (item) => ({
  id: item.id,
  typeId: item.learningMaterialTypeId,
  name: item.name,
  description: item.description,
  url: item.materialUrl,
});

export async function getLearningMaterials({ sectionId, page = 1, pageSize = 20 } = {}) {
  try {
    const qs = buildQuery({ sectionId, page, pageSize });
    const { data } = await axios.get(`${BASE}/LearningMaterials${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
    const items = Array.isArray(data.items) ? data.items.map(mapLearningMaterial) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching learning materials:', err);
    return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
  }
}

export default {
  getLearningMaterials,
};
// get learning material by section id
// get learning material by section partition id
// upload learning material
// assign learning material to section partition
// unassign learning material from section partition
// create quiz
// get quizzes by section id
// get quizzes by section partition id
// assign quiz to section partition
// unassign quiz from section partition
// get practices
// get practices by section id
// get practices by section partition id
// assign practice to section partition
// unassign practice from section partition

