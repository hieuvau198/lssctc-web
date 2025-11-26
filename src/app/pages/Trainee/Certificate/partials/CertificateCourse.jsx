import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Skeleton, message } from 'antd';
import { Award, Download } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PageNav from '../../../../components/PageNav/PageNav';
// import { getCertificateById } from '../../../../apis/Trainee/TraineeCertificateApi';
import { getMockCertificateById } from '../../../../mocks/certificates';

export default function CertificateCourse() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [cert, setCert] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		// Simulate loading with mock data
		if (!id) return;
		
		setLoading(true);
		setTimeout(() => {
			const mockData = getMockCertificateById(id);
			if (mockData) {
				setCert(mockData);
			} else {
				message.error('Không tìm thấy chứng chỉ');
				navigate('/certificate');
			}
			setLoading(false);
		}, 500);
	}, [id, navigate]);

	// Real API version (commented for now)
	// useEffect(() => {
	// 	let mounted = true;
	// 	async function fetchCertificate() {
	// 		if (!id) return;

	// 		setLoading(true);
	// 		try {
	// 			const data = await getCertificateById(id);
	// 			if (mounted) {
	// 				setCert(data);
	// 			}
	// 		} catch (err) {
	// 			console.error('Failed to fetch certificate:', err);
	// 			if (mounted) {
	// 				message.error('Không tải được thông tin chứng chỉ');
	// 				navigate('/certificate');
	// 			}
	// 		} finally {
	// 			if (mounted) setLoading(false);
	// 		}
	// 	}

	// 	fetchCertificate();
	// 	return () => { mounted = false; };
	// }, [id, navigate]);

	const downloadPdf = () => {
		window.print();
	};

	if (loading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<PageNav items={[{ title: 'Certificates', href: '/certificate' }, { title: 'Loading...' }]} />
				<div className="mt-4">
					<Skeleton active paragraph={{ rows: 8 }} />
				</div>
			</div>
		);
	}

	if (!cert) {
		return null;
	}

	const issueDate = cert.issueDate ? new Date(cert.issueDate) : null;
	const expireDate = cert.expireDate ? new Date(cert.expireDate) : null;
	const issueDateText = issueDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
	const expireDateText = expireDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

	return (
		<div className="max-w-7xl mx-auto px-4 py-6 min-h-screen flex flex-col">
			<PageNav items={[{ title: 'Certificates', href: '/certificate' }, { title: cert.courseName || cert.course || 'Certificate' }]} />
			<style>{`
				@media print {
					@page { size: A4 landscape; margin: 12mm; }
					body * { visibility: hidden; }
					.print-area, .print-area * { visibility: visible; }
					.print-area { position: absolute; inset: 0; margin: 0; }
				}
			`}</style>

			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border rounded-xl p-4 mb-4 print:hidden">
				<div className="flex items-center gap-2">
					<Award className="w-6 h-6 text-blue-600" />
					<h1 className="text-lg font-semibold text-slate-800 m-0">Your Certificate</h1>
				</div>
				<div className="sm:ml-auto">
					<Button type="primary" icon={<Download className="w-4 h-4" />} onClick={downloadPdf}>
						Download PDF
					</Button>
				</div>
			</div>

			<div className="flex-1 w-full flex items-center justify-center">
				<Card className="justify-center border-slate-200 max-w-[980px] w-full print-area">
					<div className="border-2 border-slate-200 rounded-2xl p-10 bg-white relative overflow-hidden">
						<div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-50 rounded-full" />
						<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-50 rounded-full" />
						<div className="relative">
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 mb-2 text-center">
								<Award className="w-10 h-10 text-blue-600" />
								<h2 className="text-2xl sm:text-3xl font-bold text-slate-800">Certificate of Completion</h2>
							</div>
							<p className="text-center text-slate-600 mb-6">This is to certify that</p>

							<div className="text-center">
								<div className="text-2xl sm:text-3xl font-semibold text-slate-900">
									{cert.traineeName || cert.learnerName || 'N/A'}
								</div>
								<p className="text-slate-600 mt-2">has successfully completed</p>
								<div className="text-xl sm:text-2xl font-medium text-blue-700">
									{cert.courseName || cert.course || 'N/A'}
								</div>
								<p className="text-slate-600 mt-2">
									{issueDateText && (
										<>
											on <span className="font-medium text-slate-800">{issueDateText}</span>
										</>
									)}
									{expireDateText && (
										<>
											{' '}• valid until <span className="font-medium text-slate-800">{expireDateText}</span>
										</>
									)}
								</p>
								{cert.grade != null && (
									<p className="text-slate-700">Score: <span className="font-semibold">{cert.grade}</span></p>
								)}
							</div>

							<Divider className="!my-8" />
							<div className="flex items-end justify-between">
								<div className="text-sm text-slate-600">
									Certificate ID
									<div className="font-semibold text-slate-800">
										{cert.certificateCode || cert.certificateId || 'N/A'}
									</div>
								</div>
								<div className="text-center">
									<div className="h-12" />
									<div className="border-t border-slate-300 pt-1 text-sm text-slate-700">
										{cert.issuerName || 'Training Director'}
										<div className="text-slate-500">{cert.issuerTitle || 'Authorized Signatory'}</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</Card>
			</div>
		</div>
	);
}
