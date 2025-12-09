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
 * Get all classes with pagination, search, filter, and sort
 * GET /api/Classes/paged?pageNumber=&pageSize=&searchTerm=&status=&sortBy=&sortDirection=
 * @param {{pageNumber?:number,pageSize?:number,searchTerm?:string,status?:string,sortBy?:string,sortDirection?:string}} params
 */
export async function fetchClasses({ pageNumber = 1, pageSize = 10, searchTerm, status, sortBy, sortDirection } = {}) {
	const searchParams = new URLSearchParams();
	searchParams.append("pageNumber", pageNumber);
	searchParams.append("pageSize", pageSize);
	if (searchTerm) searchParams.append("searchTerm", searchTerm);
	if (status) searchParams.append("status", status);
	if (sortBy) searchParams.append("sortBy", sortBy);
	if (sortDirection) searchParams.append("sortDirection", sortDirection);

	const qs = searchParams.toString();
	const { data } = await apiClient.get(`${CLASSES_BASE}/paged?${qs}`);

	return {
		items: data.items || [],
		totalCount: data.totalCount || 0,
		page: data.page || pageNumber,
		pageSize: data.pageSize || pageSize,
		totalPages: data.totalPages || 0,
	};
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
	const { data } = await apiClient.post(`${CLASSES_BASE}`, payload);
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
 * Enroll a Trainee to a Class
 * POST /api/Enrollments
 * @param {{classId:number,traineeId:number}} payload
 */
export async function enrollTrainee(payload) {
	if (!payload.classId) throw new Error('classId is required');
	if (!payload.traineeId) throw new Error('traineeId is required');
	const { data } = await apiClient.post('/Enrollments', payload);
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
 * PUT /api/Enrollments/{enrollmentId}/approve
 * @param {number} enrollmentId
 */
export async function approveEnrollment(enrollmentId) {
	if (enrollmentId == null) throw new Error("enrollmentId is required");
	const { data } = await apiClient.put(`/Enrollments/${enrollmentId}/approve`);
	return data;
}

/**
 * Reject an enrollment
 * PUT /api/Enrollments/{enrollmentId}/reject
 * @param {number} enrollmentId
 */
export async function rejectEnrollment(enrollmentId) {
	if (enrollmentId == null) throw new Error("enrollmentId is required");
	const { data } = await apiClient.put(`/Enrollments/${enrollmentId}/reject`);
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
 * Get trainees of a class
 * GET /api/Classes/{classId}/trainees
 */
export async function fetchClassTrainees(classId, { page = 1, pageSize = 10 } = {}) {
	if (classId == null) throw new Error("classId is required");
	const qs = buildQuery({ page, pageSize });
	const { data } = await apiClient.get(`${CLASSES_BASE}/${classId}/trainees${qs}`);
	// normalize paged response or plain array
	if (Array.isArray(data)) {
		return {
			items: data,
			totalCount: data.length,
			page,
			pageSize,
			totalPages: pageSize > 0 ? Math.ceil(data.length / pageSize) : 1,
		};
	}
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
 * Get available instructors between two dates
 * GET /api/Classes/available-instructors?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 * Accepts optional classId to exclude the current class assignment
 * @param {{startDate:string,endDate:string,classId?:string|number}} params
 */
export async function fetchAvailableInstructors({ startDate, endDate, classId } = {}) {
	if (!startDate || !endDate) throw new Error('startDate and endDate are required');
	const qs = buildQuery({ startDate, endDate, classId });
	const { data } = await apiClient.get(`${CLASSES_BASE}/available-instructors${qs}`);
	return data;
}

/**
 * Assign an Instructor to a Class (by class id)
 * POST /api/Classes/{classId}/instructor
 * @param {number} classId
 * @param {{instructorId:number, position?:string}} payload
 */
export async function addInstructorToClass(classId, payload) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.post(`${CLASSES_BASE}/${classId}/instructor`, payload);
	return data;
}

/**
 * Remove instructor assignment from a Class
 * DELETE /api/Classes/{classId}/instructor
 * @param {number} classId
 */
export async function removeInstructorFromClass(classId) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.delete(`${CLASSES_BASE}/${classId}/instructor`);
	return data;
}

/**
 * Open class (change status to Open)
 * PUT /api/Classes/{classId}/open
 */
export async function openClass(classId) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.put(`${CLASSES_BASE}/${classId}/open`);
	return data;
}

/**
 * Start class (change status to Started)
 * PUT /api/Classes/{classId}/start
 */
export async function startClass(classId) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.put(`${CLASSES_BASE}/${classId}/start`);
	return data;
}

/**
 * Complete class (change status to Completed)
 * PUT /api/Classes/{classId}/complete
 */
export async function completeClass(classId) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.put(`${CLASSES_BASE}/${classId}/complete`);
	return data;
}

/**
 * Cancel class (change status to Cancelled)
 * PUT /api/Classes/{classId}/cancel
 */
export async function cancelClass(classId) {
	if (classId == null) throw new Error("classId is required");
	const { data } = await apiClient.put(`${CLASSES_BASE}/${classId}/cancel`);
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

/**
 * Delete class by id
 * DELETE /api/Classes/{id}
 * @param {number|string} id
 */
export async function deleteClass(id) {
	if (id == null) throw new Error("id is required");
	const { data } = await apiClient.delete(`${CLASSES_BASE}/${id}`);
	return data;
}

// Export grouped object (optional convenience)
export const ClassesApi = {
	fetchClasses,
	fetchClassesByProgramCourse,
	createClass,
	deleteClass,
	assignInstructor,
	addInstructorToClass,
	assignTrainee,
	enrollTrainee,
	fetchClassEnrollment,
	approveEnrollment,
	rejectEnrollment,
	fetchClassMembers,
	fetchClassTrainees,
	fetchClassInstructor,
	removeInstructorFromClass,
	openClass,
	startClass,
	completeClass,
	cancelClass,
	fetchMemberProgress,
	createTrainingProgress,
	updateTrainingProgress,
	fetchTrainingResults,
	createTrainingResult,
	updateTrainingResult,
	createClassSection,
	createSyllabusSection,
};

