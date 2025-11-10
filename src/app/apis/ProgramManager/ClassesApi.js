import apiClient from '../../libs/axios';

// Base path for Classes endpoints (apiClient already sets baseURL)
const CLASSES_BASE = `/Classes`;

/**
 * Helper: build query string for pagination or generic params
 * @param {Record<string, any>} params
 */
function buildQuery(params = {}) {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([k, v]) => {
		if (v !== undefined && v !== null && v !== "") searchParams.append(k, v);
	});
	const qs = searchParams.toString();
	return qs ? `?${qs}` : "";
}

/**
 * Get all classes with pagination
 * GET /api/Classes?page=&pageSize=
 * @param {{page?:number,pageSize?:number}} options
 */
export async function fetchClasses({ page = 1, pageSize = 10 } = {}) {
	const qs = buildQuery({ page, pageSize });
	const { data } = await apiClient.get(`${CLASSES_BASE}${qs}`);

	// Normalize when backend returns a plain array
	if (Array.isArray(data)) {
		const totalCount = data.length;
		const totalPages = pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;
		return {
			items: data,
			totalCount,
			page,
			pageSize,
			totalPages,
		};
	}

	// otherwise assume server returned paged shape already
	return data;
}

/**
 * Get classes by ProgramCourseId
 * GET /api/Classes/programcourse/{programCourseId}
 */
export async function fetchClassesByProgramCourse(programCourseId) {
	if (programCourseId == null) throw new Error("programCourseId is required");
	const { data } = await apiClient.get(
		`${CLASSES_BASE}/programcourse/${programCourseId}`
	);
	return data;
}

/**
 * Create a new empty Class
 * POST /api/Classes/create
 * @param {Object} payload - matches ClassCreateDto
 */
export async function createClass(payload) {
	const { data } = await apiClient.post(`${CLASSES_BASE}/create`, payload);
	return data;
}

/**
 * Assign an Instructor to a Class
 * POST /api/Classes/assign-instructor
 * @param {{classId:number,instructorId:number,position?:string}} payload
 */
export async function assignInstructor(payload) {
	const { data } = await apiClient.post(
		`${CLASSES_BASE}/assign-instructor`,
		payload
	);
	return data;
}

/**
 * Assign a Trainee to a Class
 * POST /api/Classes/assign-trainee
 * @param {{classId:number,traineeId:number,name?:string,description?:string,traineeContact?:string}} payload
 */
export async function assignTrainee(payload) {
	const { data } = await apiClient.post(`${CLASSES_BASE}/assign-trainee`, payload);
	return data;
}

/**
 * Get enrollment by ClassId (first enrollment if multiple)
 * GET /api/Classes/{classId}/enrollment
 */
export async function fetchClassEnrollment(classId) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.get(`${CLASSES_BASE}/${classId}/enrollment`);
	return data;
}

/**
 * Approve an enrollment
 * POST /api/Classes/approve-enrollment
 * @param {{enrollmentId:number,description?:string}} payload
 */
export async function approveEnrollment(payload) {
	const { data } = await apiClient.post(
		`${CLASSES_BASE}/approve-enrollment`,
		payload
	);
	return data;
}

/**
 * Get all members of a class
 * GET /api/Classes/{classId}/members
 */
export async function fetchClassMembers(classId) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.get(`${CLASSES_BASE}/${classId}/members`);
	return data;
}

/**
 * Get instructor of a class
 * GET /api/Classes/{classId}/instructor
 */
export async function fetchClassInstructor(classId) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.get(`${CLASSES_BASE}/${classId}/instructor`);
	return data;
}

/**
 * Get training progress list by ClassMemberId
 * GET /api/Classes/members/{memberId}/progress
 */
export async function fetchMemberProgress(memberId) {
	if (memberId == null) throw new Error("memberId is required");
	const { data } = await apiClient.get(
		`${CLASSES_BASE}/members/${memberId}/progress`
	);
	return data;
}

/**
 * Add new training progress for a ClassMember
 * POST /api/Classes/progress
 * @param {{courseMemberId:number,status?:string,name?:string,description?:string,progressPercentage?:number,startDate?:string,lastUpdated?:string}} payload
 */
export async function createTrainingProgress(payload) {
	const { data } = await apiClient.post(`${CLASSES_BASE}/progress`, payload);
	return data;
}

/**
 * Update training progress
 * PUT /api/Classes/progress
 * @param {{id:number,status?:string,progressPercentage?:number,description?:string}} payload
 */
export async function updateTrainingProgress(payload) {
	const { data } = await apiClient.put(`${CLASSES_BASE}/progress`, payload);
	return data;
}

/**
 * Get all training results by TrainingProgressId
 * GET /api/Classes/progress/{progressId}/results
 */
export async function fetchTrainingResults(progressId) {
	if (progressId == null) throw new Error("progressId is required");
	const { data } = await apiClient.get(
		`${CLASSES_BASE}/progress/${progressId}/results`
	);
	return data;
}

/**
 * Add a new training result
 * POST /api/Classes/results
 * @param {{trainingProgressId:number,trainingResultTypeId:number,resultValue?:string,resultDate?:string,notes?:string}} payload
 */
export async function createTrainingResult(payload) {
	const { data } = await apiClient.post(`${CLASSES_BASE}/results`, payload);
	return data;
}

/**
 * Update an existing training result
 * PUT /api/Classes/results
 * @param {{id:number,resultValue?:string,notes?:string}} payload
 */
export async function updateTrainingResult(payload) {
	const { data } = await apiClient.put(`${CLASSES_BASE}/results`, payload);
	return data;
}

/**
 * Create a new Section for a Class
 * POST /api/Classes/sections
 * @param {{classId:number,name?:string,description?:string,syllabusSectionId:number,durationMinutes?:number,order?:number,startDate?:string,endDate?:string}} payload
 */
export async function createClassSection(payload) {
	const { data } = await apiClient.post(`${CLASSES_BASE}/sections`, payload);
	return data;
}

/**
 * Create a new Syllabus Section
 * POST /api/Classes/syllabus-sections
 * @param {{syllabusName?:string,courseName?:string,courseCode?:string,sectionTitle?:string,sectionDescription?:string,sectionOrder?:number,estimatedDurationMinutes?:number}} payload
 */
export async function createSyllabusSection(payload) {
	const { data } = await apiClient.post(
		`${CLASSES_BASE}/syllabus-sections`,
		payload
	);
	return data;
}

// Export grouped object (optional convenience)
export const ClassesApi = {
	fetchClasses,
	fetchClassesByProgramCourse,
	createClass,
	assignInstructor,
	assignTrainee,
	fetchClassEnrollment,
	approveEnrollment,
	fetchClassMembers,
	fetchClassInstructor,
	fetchMemberProgress,
	createTrainingProgress,
	updateTrainingProgress,
	fetchTrainingResults,
	createTrainingResult,
	updateTrainingResult,
	createClassSection,
	createSyllabusSection,
};

