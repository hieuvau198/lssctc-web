import apiClient from '../../libs/axios';

function buildQuery(params = {}) {
	const searchParams = new URLSearchParams();
	Object.entries(params).forEach(([k, v]) => {
		if (v !== undefined && v !== null && v !== '') searchParams.append(k, v);
	});
	const qs = searchParams.toString();
	return qs ? `?${qs}` : '';
}

const mapUserFromApi = (item) => ({
	id: item.id,
	username: item.username,
	email: item.email,
	fullName: item.fullname || item.fullName || item.name || '',
	role: item.role,
	phoneNumber: item.phoneNumber || item.phone || null,
	avatarUrl: item.avatarUrl || item.avatar || null,
	isActive: Boolean(item.isActive),
});

/**
 * Get all users (paginated optional)
 * @param {{ page?: number, pageSize?: number, q?: string }} params
 */
export async function getUsers(params = {}) {
	try {
		const qs = buildQuery(params);
		const { data } = await apiClient.get(`/Users${qs}`);
		if (!data) return { items: [], total: 0 };

		const items = Array.isArray(data) ? data.map(mapUserFromApi) : (Array.isArray(data.items) ? data.items.map(mapUserFromApi) : []);
		const total = data.total || data.totalCount || items.length;
		return { items, total: Number(total) || items.length, raw: data };
	} catch (err) {
		console.error('Error fetching users:', err);
		throw err;
	}
}

export async function getTrainees(params = {}) {
	try {
		const qs = buildQuery(params);
		const { data } = await apiClient.get(`/Users/trainees${qs}`);
		if (!data) return { items: [], total: 0 };
		const items = Array.isArray(data) ? data.map(mapUserFromApi) : (Array.isArray(data.items) ? data.items.map(mapUserFromApi) : []);
		const total = data.total || data.totalCount || items.length;
		return { items, total: Number(total) || items.length, raw: data };
	} catch (err) {
		console.error('Error fetching trainees:', err);
		throw err;
	}
}

export async function getInstructors(params = {}) {
	try {
		const qs = buildQuery(params);
		const { data } = await apiClient.get(`/Users/instructors${qs}`);
		if (!data) return { items: [], total: 0 };
		const items = Array.isArray(data) ? data.map(mapUserFromApi) : (Array.isArray(data.items) ? data.items.map(mapUserFromApi) : []);
		const total = data.total || data.totalCount || items.length;
		return { items, total: Number(total) || items.length, raw: data };
	} catch (err) {
		console.error('Error fetching instructors:', err);
		throw err;
	}
}

export async function getSimulationManagers(params = {}) {
	try {
		const qs = buildQuery(params);
		const { data } = await apiClient.get(`/Users/simulation-managers${qs}`);
		if (!data) return { items: [], total: 0 };
		const items = Array.isArray(data) ? data.map(mapUserFromApi) : (Array.isArray(data.items) ? data.items.map(mapUserFromApi) : []);
		const total = data.total || data.totalCount || items.length;
		return { items, total: Number(total) || items.length, raw: data };
	} catch (err) {
		console.error('Error fetching simulation managers:', err);
		throw err;
	}
}

export async function getUserById(id) {
	try {
		const { data } = await apiClient.get(`/Users/${id}`);
		if (!data) throw new Error('User not found');
		return mapUserFromApi(data);
	} catch (err) {
		console.error('Error fetching user by id:', err);
		throw err;
	}

}

export default {
	getUsers,
	getTrainees,
	getInstructors,
	getSimulationManagers,
	getUserById,
};

