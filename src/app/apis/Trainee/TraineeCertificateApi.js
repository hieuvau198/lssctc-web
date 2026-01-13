import apiClient from '../../libs/axios';

/**
 * Get all trainee certificates (Admin/Instructor view)
 * GET /api/TraineeCertificates
 * @returns {Promise<Array<{id, traineeName, courseName, certificateCode, pdfUrl, issuedDate}>>}
 */
export async function getAllTraineeCertificates() {
	try {
		const response = await apiClient.get('/TraineeCertificates');
		return response.data?.data || response.data || [];
	} catch (error) {
		console.error('Error fetching all trainee certificates:', error);
		throw error;
	}
}

/**
 * Get certificates for the currently authenticated trainee (by token)
 * GET /api/TraineeCertificates/my-certificates
 * @returns {Promise<Array<{id, traineeName, courseName, certificateCode, pdfUrl, issuedDate}>>}
 */
export async function getMyCertificates() {
	try {
		const response = await apiClient.get('/TraineeCertificates/my-certificates');
		return response.data?.data || response.data || [];
	} catch (error) {
		console.error('Error fetching my certificates:', error);
		throw error;
	}
}

/**
 * Create a new trainee certificate
 * POST /api/TraineeCertificates
 * @param {Object} payload - Certificate data
 * @returns {Promise<Object>}
 */
export async function createTraineeCertificate(payload) {
	try {
		const response = await apiClient.post('/TraineeCertificates', payload);
		return response.data?.data || response.data;
	} catch (error) {
		console.error('Error creating trainee certificate:', error);
		throw error;
	}
}

/**
 * Get certificate by ID
 * GET /api/TraineeCertificates/{id}
 * @param {number} id - Certificate ID
 * @returns {Promise<Object>}
 */
export async function getTraineeCertificateById(id) {
	if (!id) throw new Error('Certificate ID is required');
	try {
		const response = await apiClient.get(`/TraineeCertificates/${id}`);
		return response.data?.data || response.data;
	} catch (error) {
		console.error('Error fetching certificate by ID:', error);
		throw error;
	}
}

/**
 * Delete certificate by ID
 * DELETE /api/TraineeCertificates/{id}
 * @param {number} id - Certificate ID
 * @returns {Promise<void>}
 */
export async function deleteTraineeCertificate(id) {
	if (!id) throw new Error('Certificate ID is required');
	try {
		const response = await apiClient.delete(`/TraineeCertificates/${id}`);
		return response.data;
	} catch (error) {
		console.error('Error deleting certificate:', error);
		throw error;
	}
}

/**
 * Get certificate by code
 * GET /api/TraineeCertificates/code/{code}
 * @param {string} code - Certificate code
 * @returns {Promise<Object>}
 */
export async function getTraineeCertificateByCode(code) {
	if (!code) throw new Error('Certificate code is required');
	try {
		const response = await apiClient.get(`/TraineeCertificates/code/${code}`);
		return response.data?.data || response.data;
	} catch (error) {
		console.error('Error fetching certificate by code:', error);
		throw error;
	}
}

/**
 * Get all certificates for a trainee (legacy - kept for backward compatibility)
 * GET /api/Trainees/{traineeId}/certificates
 * @param {number} traineeId
 */
export async function getTraineeCertificates(traineeId) {
	if (!traineeId) throw new Error('traineeId is required');
	const { data } = await apiClient.get(`/Trainees/${traineeId}/certificates`);
	return Array.isArray(data) ? data : [];
}

/**
 * Get certificate detail by ID (legacy - kept for backward compatibility)
 * GET /api/Certificates/{certificateId}
 * @param {number} certificateId
 */
export async function getCertificateById(certificateId) {
	if (!certificateId) throw new Error('certificateId is required');
	const { data } = await apiClient.get(`/Certificates/${certificateId}`);
	return data;
}
