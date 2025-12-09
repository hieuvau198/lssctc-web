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
		const apiParams = {
			pageNumber: params.pageNumber || params.page || 1,
			pageSize: params.pageSize || 10,
		};
		if (params.searchTerm) apiParams.searchTerm = params.searchTerm;
		if (params.isActive !== undefined && params.isActive !== null && params.isActive !== '') {
			apiParams.isActive = params.isActive;
		}

		const qs = buildQuery(apiParams);
		const { data } = await apiClient.get(`/Users/trainees${qs}`);

		if (!data) return { items: [], totalCount: 0 };

		const items = (data.items || []).map(mapUserFromApi);
		return {
			items,
			totalCount: data.totalCount || 0,
			page: data.page,
			pageSize: data.pageSize,
			totalPages: data.totalPages
		};
	} catch (err) {
		console.error('Error fetching trainees:', err);
		throw err;
	}
}

export async function getInstructors(params = {}) {
	try {
		const apiParams = {
			pageNumber: params.pageNumber || params.page || 1,
			pageSize: params.pageSize || 10,
		};
		if (params.searchTerm) apiParams.searchTerm = params.searchTerm;
		if (params.isActive !== undefined && params.isActive !== null && params.isActive !== '') {
			apiParams.isActive = params.isActive;
		}

		const qs = buildQuery(apiParams);
		const { data } = await apiClient.get(`/Users/instructors${qs}`);

		if (!data) return { items: [], totalCount: 0 };

		const items = (data.items || []).map(mapUserFromApi);
		return {
			items,
			totalCount: data.totalCount || 0,
			page: data.page,
			pageSize: data.pageSize,
			totalPages: data.totalPages
		};
	} catch (err) {
		console.error('Error fetching instructors:', err);
		throw err;
	}
}

export async function getSimulationManagers(params = {}) {
	try {
		const apiParams = {
			pageNumber: params.pageNumber || params.page || 1,
			pageSize: params.pageSize || 10,
		};
		if (params.searchTerm) apiParams.searchTerm = params.searchTerm;
		if (params.isActive !== undefined && params.isActive !== null && params.isActive !== '') {
			apiParams.isActive = params.isActive;
		}

		const qs = buildQuery(apiParams);
		const { data } = await apiClient.get(`/Users/simulation-managers${qs}`);

		if (!data) return { items: [], totalCount: 0 };

		const items = (data.items || []).map(mapUserFromApi);
		return {
			items,
			totalCount: data.totalCount || 0,
			page: data.page,
			pageSize: data.pageSize,
			totalPages: data.totalPages
		};
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

export async function updateUser(id, payload = {}) {
	try {
		const { data } = await apiClient.put(`/Users/${id}`, payload);
		return data; // API returns 204 No Content typically, but if 200 data is returned
	} catch (err) {
		console.error('Error updating user:', err);
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
		const { data } = await apiClient.post(`/Users/simulation-managers`, { ...payload, role: 'SimulationManager' });
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
	downloadInstructorTemplate,
	importInstructorFromExcel,
	downloadSimulationManagerTemplate,
	importSimulationManagerFromExcel,
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

/**
 * Download instructor import template
 * Endpoint: /user-downloads/instructor-template
 */
export async function downloadInstructorTemplate() {
	try {
		// User confirmed that instructor uses the same template as trainee
		const response = await apiClient.get('user-downloads/trainee-template', {
			responseType: 'blob',
		});

		let filename = 'Instructor_Import_Template.xlsx';
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
		console.error('Error downloading instructor template:', err);
		throw err;
	}
}

/**
 * Import instructors from Excel file
 * @param {File} file - Excel file
 */
export async function importInstructorFromExcel(file) {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const { data } = await apiClient.post('/Users/import-instructors', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data;
	} catch (err) {
		console.error('Error importing instructors from Excel:', err);
		throw err;
	}
}

/**
 * Download simulation manager import template
 * Uses the same template as trainee/instructor
 */
export async function downloadSimulationManagerTemplate() {
	try {
		const response = await apiClient.get('user-downloads/trainee-template', {
			responseType: 'blob',
		});

		let filename = 'SimulationManager_Import_Template.xlsx';
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
		console.error('Error downloading simulation manager template:', err);
		throw err;
	}
}

/**
 * Import simulation managers from Excel file
 * @param {File} file - Excel file
 */
export async function importSimulationManagerFromExcel(file) {
	try {
		const formData = new FormData();
		formData.append('file', file);

		const { data } = await apiClient.post('/Users/import-simulation-managers', formData, {
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		});

		return data;
	} catch (err) {
		console.error('Error importing simulation managers from Excel:', err);
		throw err;
	}
}

