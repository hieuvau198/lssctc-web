import axios from 'axios';
import { apiClient } from '../../libs/axios';

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

const mapLearningMaterial = (item) => {
  const typeName = item.learningMaterialType ?? item.learningMaterialTypeName ?? null;
  let typeId = item.learningMaterialTypeId ?? null;
  if (!typeId && typeName) {
    const s = String(typeName).toLowerCase();
    if (s.includes('video')) typeId = 1; // Video = 1 in enum
    else if (s.includes('document') || s.includes('doc')) typeId = 2; // Document = 2
  }

  return {
    id: item.id,
    typeId,
    typeName,
    name: item.name,
    description: item.description,
    url: item.materialUrl ?? item.url ?? item.material_url ?? null,
    _raw: item,
  };
};

const mapSectionFromApi = (item) => ({
  id: item.id,
  name: item.name,
  description: item.description,
  classesId: item.classesId,
  syllabusSectionId: item.syllabusSectionId,
  durationMinutes: item.durationMinutes,
  order: item.order,
  startDate: item.startDate,
  endDate: item.endDate,
  status: item.status,
});

const mapPartitionFromApi = (item) => ({
  id: item.id,
  sectionId: item.sectionId,
  name: item.name,
  partitionTypeId: item.partitionTypeId,
  displayOrder: item.displayOrder,
  description: item.description,
});

const mapClassMemberFromApi = (item) => ({
  id: item.id,
  traineeId: item.traineeId,
  classId: item.classId,
  assignedDate: item.assignedDate,
  status: item.status,
  trainee: item.trainee || null,
  trainingProgresses: Array.isArray(item.trainingProgresses) ? item.trainingProgresses : [],
});

export async function getLearningMaterials({ sectionId, page = 1, pageSize = 20 } = {}) {
  try {
    const qs = buildQuery({ sectionId, page, pageSize });
    const { data } = await axios.get(`${BASE}/Materials/paged${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };

    // Support two shapes: an array (old/new simple endpoints) or paged object { items, totalCount, page, pageSize }
    const rawItems = Array.isArray(data) ? data : Array.isArray(data.items) ? data.items : [];
    const items = rawItems.map(mapLearningMaterial);
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || Math.ceil((Number(data.totalCount) || items.length) / pageSize) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching learning materials:', err);
    return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
  }
}

export async function getSectionsByClass(classId, { page = 1, pageSize = 20 } = {}) {
  try {
    const qs = buildQuery({ page, pageSize });
    const { data } = await axios.get(`${BASE}/Sections/by-class/${encodeURIComponent(classId)}${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
    const items = Array.isArray(data.items) ? data.items.map(mapSectionFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching sections by class:', err);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
}

export async function getSectionPartitionsBySection(sectionId, { page = 1, pageSize = 20 } = {}) {
  try {
    const qs = buildQuery({ page, pageSize });
    const { data } = await axios.get(`${BASE}/SectionPartitions/by-section/${encodeURIComponent(sectionId)}${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
    const items = Array.isArray(data.items) ? data.items.map(mapPartitionFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching section partitions by section:', err);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
}

export async function getClassMembers(classId, { page = 1, pageSize = 20 } = {}) {
  try {
    const qs = buildQuery({ page, pageSize });
    const { data } = await axios.get(`${BASE}/Classes/${encodeURIComponent(classId)}/members${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
    const items = Array.isArray(data.items) ? data.items.map(mapClassMemberFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching class members:', err);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
}

export async function getAllPartitions({ page = 1, pageSize = 200 } = {}) {
  try {
    const qs = buildQuery({ page, pageSize });
    const { data } = await axios.get(`${BASE}/SectionPartitions${qs}`);
    if (!data) return { items: [], totalCount: 0, page: 1, pageSize, totalPages: 0 };
    const items = Array.isArray(data.items) ? data.items.map(mapPartitionFromApi) : [];
    return {
      items,
      totalCount: Number(data.totalCount) || items.length,
      page: Number(data.page) || page,
      pageSize: Number(data.pageSize) || pageSize,
      totalPages: Number(data.totalPages) || 1,
      raw: data,
    };
  } catch (err) {
    console.error('Error fetching all partitions:', err);
    return { items: [], totalCount: 0, page, pageSize, totalPages: 0 };
  }
}

export async function createLearningMaterial(payload) {
  try {
    if (!payload || !payload.name || !payload.materialUrl || !payload.learningMaterialType) {
      throw new Error('Missing required fields: name, materialUrl, learningMaterialType');
    }
    const { data } = await apiClient.post(`${BASE}/Materials`, payload);
    if (!data) return null;
    // If API returns the created object or a paged wrapper, handle accordingly
    const raw = Array.isArray(data) ? data[0] : data;
    return mapLearningMaterial(raw);
  } catch (err) {
    console.error('Error creating learning material:', err);
    throw err;
  }
}

export async function assignPartitionToSection(sectionId, partitionId) {
  try {
    const { data } = await axios.post(`${BASE}/SectionPartitions/${encodeURIComponent(partitionId)}/assign`, { sectionId });
    return data;
  } catch (err) {
    console.error('Error assigning partition to section:', err);
    throw err;
  }
}

export async function unassignPartitionFromSection(sectionId, partitionId) {
  try {
    const { data } = await axios.post(`${BASE}/SectionPartitions/${encodeURIComponent(partitionId)}/unassign`, { sectionId });
    return data;
  } catch (err) {
    console.error('Error unassigning partition from section:', err);
    throw err;
  }
}

export default {
  getLearningMaterials,
  getSectionsByClass,
  getSectionPartitionsBySection,
  getClassMembers,
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

