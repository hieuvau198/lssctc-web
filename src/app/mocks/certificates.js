// Mock data for certificates
export const mockCertificates = [
	{
		id: 1,
		certificateCode: 'LSS-2025-0001',
		certificateId: 'LSS-2025-0001',
		courseName: 'Seaport Crane Basic Operations',
		course: 'Seaport Crane Basic Operations',
		traineeName: 'Nguyen Van A',
		learnerName: 'Nguyen Van A',
		issueDate: '2025-09-10T00:00:00Z',
		expireDate: '2027-09-10T00:00:00Z',
		grade: 92,
		issuerName: 'John Anderson',
		issuerTitle: 'Training Director',
	},
	{
		id: 2,
		certificateCode: 'LSS-2025-0002',
		certificateId: 'LSS-2025-0002',
		courseName: 'Advanced Crane Safety',
		course: 'Advanced Crane Safety',
		traineeName: 'Nguyen Van A',
		learnerName: 'Nguyen Van A',
		issueDate: '2025-08-15T00:00:00Z',
		expireDate: '2026-02-15T00:00:00Z',
		grade: 88,
		issuerName: 'Sarah Johnson',
		issuerTitle: 'Safety Director',
	},
	{
		id: 3,
		certificateCode: 'LSS-2024-0156',
		certificateId: 'LSS-2024-0156',
		courseName: 'Mobile Crane Operations',
		course: 'Mobile Crane Operations',
		traineeName: 'Nguyen Van A',
		learnerName: 'Nguyen Van A',
		issueDate: '2024-06-20T00:00:00Z',
		expireDate: '2025-01-20T00:00:00Z',
		grade: 95,
		issuerName: 'Michael Brown',
		issuerTitle: 'Operations Manager',
	},
];

export function getMockCertificates() {
	return mockCertificates;
}

export function getMockCertificateById(id) {
	return mockCertificates.find(cert => cert.id === parseInt(id));
}
