import apiClient from '../../libs/axios';

const ENROLLMENTS_BASE = '/Enrollments';

function buildQuery(params = {}) {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([k, v]) => {
		if (v !== undefined && v !== null && v !== "") searchParams.append(k, v);
	});
	const qs = searchParams.toString();
	return qs ? `?${qs}` : "";
}


export async function getMyEnrollments() {
	const { data } = await apiClient.get(`${ENROLLMENTS_BASE}/my-enrollments`);
	return data;
}

export async function getMyEnrollmentsPaged({ page = 1, pageSize = 10 } = {}) {
	const qs = buildQuery({ page, pageSize });
	const { data } = await apiClient.get(`${ENROLLMENTS_BASE}/my-enrollments/paged${qs}`);
	
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

// Export grouped object (optional convenience)
export const TraineeEnrollmentApi = {
	getMyEnrollments,
	getMyEnrollmentsPaged,
};
