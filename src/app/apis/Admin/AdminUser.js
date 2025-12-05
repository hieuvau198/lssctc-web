// src\app\apis\Admin\AdminUser.js
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

export async function createTrainee(payload = {}) {
	try {
		const { data } = await apiClient.post(`/Users/trainees`, payload);
		if (!data) throw new Error('Failed to create trainee');
		return mapUserFromApi(data);
	} catch (err) {
		console.error('Error creating trainee:', err);
		throw err;
	}
}

export async function createInstructor(payload = {}) {
	try {
		const { data } = await apiClient.post(`/Users/instructors`, payload);
		if (!data) throw new Error('Failed to create instructor');
		return mapUserFromApi(data);
	} catch (err) {
		console.error('Error creating instructor:', err);
		throw err;
	}
}

export async function createSimulationManager(payload = {}) {
	try {
		const { data } = await apiClient.post(`/Users/simulation-managers`, payload);
		if (!data) throw new Error('Failed to create simulation manager');
		return mapUserFromApi(data);
	} catch (err) {
		console.error('Error creating simulation manager:', err);
		throw err;
	}
}

export default {
	getUsers,
	getTrainees,
	getInstructors,
	getSimulationManagers,
	getUserById,
	createTrainee,
	createInstructor,
	createSimulationManager,
	downloadTraineeTemplate,
	importTraineeFromExcel,
};

/**
 * Download trainee import template
 * Endpoint: /user-downloads/trainee-template
 */
export async function downloadTraineeTemplate() {
	try {
		const response = await apiClient.get('user-downloads/trainee-template', {
			responseType: 'blob',
		});

		let filename = 'Trainee_Import_Template.xlsx';
		const contentDisposition = response.headers['content-disposition'];

		if (contentDisposition) {
			const filenameStarMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
			if (filenameStarMatch && filenameStarMatch[1]) {
				filename = decodeURIComponent(filenameStarMatch[1]);
			} else {
				const filenameMatch = contentDisposition.match(/filename[^;=\n]*=["']?([^"';\n]+)["']?/i);
				if (filenameMatch && filenameMatch[1]) {
					filename = filenameMatch[1].trim();
				}
			}
		}

		const blob = new Blob([response.data], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		const url = window.URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = filename;
		link.style.display = 'none';

		document.body.appendChild(link);

		setTimeout(() => {
			link.click();
			setTimeout(() => {
				document.body.removeChild(link);
				window.URL.revokeObjectURL(url);
			}, 100);
		}, 0);

	} catch (err) {
		console.error('Error downloading trainee template:', err);
		throw err;
	}
}

/**
 * Import trainees from Excel file
 * @param {File} file - Excel file
 */
export async function importTraineeFromExcel(file) {
	try {
		const formData = new FormData();
		formData.append('file', file); // Lowercase 'file' to match curl command

		const { data } = await apiClient.post('/Users/import-trainees', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data;
	} catch (err) {
		console.error('Error importing trainees from Excel:', err);
		throw err;
	}
}

