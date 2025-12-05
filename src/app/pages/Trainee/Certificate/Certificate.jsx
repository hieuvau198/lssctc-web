import React, { useEffect, useState } from 'react';
import { Card, Empty, Skeleton, Tag, message } from 'antd';
import { Award, Calendar, GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageNav from '../../../components/PageNav/PageNav';
import { getAllTraineeCertificates } from '../../../apis/Trainee/TraineeCertificateApi';
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import useAuthStore from '../../../store/authStore';

export default function CertificateView() {
	const { t } = useTranslation();
	const authState = useAuthStore();
	const traineeIdFromStore = authState.nameid;
	const [certificates, setCertificates] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let mounted = true;
		async function fetchCertificates() {
			const token = getAuthToken();
			const decoded = token ? decodeToken(token) : null;
			const resolvedTraineeId = traineeIdFromStore || decoded?.nameid || decoded?.nameId || decoded?.sub || null;

			if (!resolvedTraineeId) {
				if (mounted) {
					message.error('Trainee id not available');
				}
				return;
			}

			setLoading(true);
			try {
				const data = await getAllTraineeCertificates();
				// Show all certificates or filter if needed
				if (mounted) {
					setCertificates(data);
				}
			} catch (err) {
				console.error('Failed to fetch certificates:', err);
				if (mounted) {
					message.error('Failed to load certificates');
					setCertificates([]);
				}
			} finally {
				if (mounted) setLoading(false);
			}
		}

		fetchCertificates();
		return () => { mounted = false; };
	}, [traineeIdFromStore, authState.name]);

	const getStatusColor = (expireDate) => {
		if (!expireDate) return 'blue';
		const exp = new Date(expireDate);
		const now = new Date();
		if (exp < now) return 'red';
		const daysLeft = Math.floor((exp - now) / (1000 * 60 * 60 * 24));
		if (daysLeft < 90) return 'orange';
		return 'green';
	};

	const getStatusText = (expireDate) => {
		if (!expireDate) return t('trainee.certificate.valid');
		const exp = new Date(expireDate);
		const now = new Date();
		if (exp < now) return t('trainee.certificate.expired');
		const daysLeft = Math.floor((exp - now) / (1000 * 60 * 60 * 24));
		if (daysLeft < 90) return t('trainee.certificate.expiringSoon');
		return t('trainee.certificate.valid');
	};

	if (loading) {
		return (
			<div className="max-w-7xl mx-auto px-4 py-8">
				<PageNav items={[{ title: 'Certificates' }]} />
				<div className="mt-4">
					<Skeleton active paragraph={{ rows: 6 }} />
				</div>
			</div>
		);
	}

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<PageNav nameMap={{ certificate: 'Certificates' }} />
			<div className="mt-2 space-y-6">
				<div>
					<h1 className="text-2xl font-semibold text-slate-900 mb-4">{t('trainee.certificate.title')}</h1>
				</div>

			{certificates.length === 0 ? (
				<div className='min-h-screen '>
					<Card className="rounded-xl shadow-md">
						<Empty
							description={t('trainee.certificate.noCertificates')}
							image={Empty.PRESENTED_IMAGE_SIMPLE}
						/>
					</Card>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{certificates.map((cert) => {
						const issueDate = cert.issuedDate ? new Date(cert.issuedDate) : null;
						const expireDate = cert.expireDate ? new Date(cert.expireDate) : null;
						const statusColor = getStatusColor(cert.expireDate);
						const statusText = getStatusText(cert.expireDate);

						return (
							<Link
								key={cert.id}
								to={`/certificate/${cert.id}`}
								className="block"
							>
								<Card
									hoverable
									className="rounded-xl shadow-md hover:shadow-xl transition-all duration-300 h-full"
									cover={
										cert.pdfUrl ? (
											<div className="relative h-48 bg-slate-100 overflow-hidden">
												<iframe
													src={`${cert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
													className="w-full h-full pointer-events-none"
													title={t('trainee.certificate.preview')}
													scrolling="no"
												/>
												<Tag
													color={statusColor}
													className="absolute top-3 right-3 z-10"
												>
													{statusText}
												</Tag>
											</div>
										) : (
											<div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 flex items-center justify-center relative h-48">
												<Award className="w-16 h-16 text-white" />
												<Tag
													color={statusColor}
													className="absolute top-3 right-3"
												>
													{statusText}
												</Tag>
											</div>
										)
									}
								>
									<div className="space-y-3">
										<div>
											<h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-2">
												{cert.courseName || cert.course || 'Certificate'}
											</h3>
											<p className="text-sm text-slate-600">
												{cert.certificateCode || cert.certificateId || 'N/A'}
											</p>
										</div>

										<div className="space-y-2 pt-2 border-t border-slate-100">
											<div className="flex items-center gap-2 text-sm text-slate-600">
												<GraduationCap className="w-4 h-4" />
												<span className="line-clamp-1">{cert.traineeName || cert.learnerName || 'N/A'}</span>
											</div>
											{issueDate && (
												<div className="flex items-center gap-2 text-sm text-slate-600">
													<Calendar className="w-4 h-4" />
													<span>{t('trainee.certificate.issued')}: {issueDate.toLocaleDateString()}</span>
												</div>
											)}
											{expireDate && (
												<div className="flex items-center gap-2 text-sm text-slate-600">
													<Calendar className="w-4 h-4" />
													<span>{t('trainee.certificate.expires')}: {expireDate.toLocaleDateString()}</span>
												</div>
											)}
										</div>

										{cert.grade != null && (
											<div className="pt-2 border-t border-slate-100">
												<div className="text-center">
													<span className="text-2xl font-bold text-blue-600">{cert.grade}</span>
													<span className="text-slate-500 ml-1">/ 100</span>
												</div>
											</div>
										)}
									</div>
								</Card>
							</Link>
						);
					})}
				</div>
			)}
			</div>
		</div>
	);
}

