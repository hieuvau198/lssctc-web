import apiClient from '../../libs/axios';

/**
 * Get all certificates for a trainee
 * GET /api/Trainees/{traineeId}/certificates
 * @param {number} traineeId
 */
export async function getTraineeCertificates(traineeId) {
	if (!traineeId) throw new Error('traineeId is required');
	const { data } = await apiClient.get(`/Trainees/${traineeId}/certificates`);
	return Array.isArray(data) ? data : [];
}

/**
 * Get certificate detail by ID
 * GET /api/Certificates/{certificateId}
 * @param {number} certificateId
 */
export async function getCertificateById(certificateId) {
	if (!certificateId) throw new Error('certificateId is required');
	const { data } = await apiClient.get(`/Certificates/${certificateId}`);
	return data;
}
