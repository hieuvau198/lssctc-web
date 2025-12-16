import { useEffect, useState } from 'react';
import { Empty, Skeleton, message } from 'antd';
import { Award, Calendar, GraduationCap, Sparkles } from 'lucide-react';
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
		if (!expireDate) return { bg: 'from-blue-50 to-cyan-50', text: 'text-blue-600', border: 'border-blue-200', dot: 'bg-blue-500' };
		const exp = new Date(expireDate);
		const now = new Date();
		if (exp < now) return { bg: 'from-red-50 to-rose-50', text: 'text-red-600', border: 'border-red-200', dot: 'bg-red-500' };
		const daysLeft = Math.floor((exp - now) / (1000 * 60 * 60 * 24));
		if (daysLeft < 90) return { bg: 'from-amber-50 to-orange-50', text: 'text-amber-600', border: 'border-amber-200', dot: 'bg-amber-500' };
		return { bg: 'from-emerald-50 to-green-50', text: 'text-emerald-600', border: 'border-emerald-200', dot: 'bg-emerald-500' };
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

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-cyan-50/80 via-blue-50/50 to-white border-b border-slate-200/60 overflow-hidden">
				{/* Decorative Blurs */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
				<div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

				<div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-10">
					<PageNav nameMap={{ certificate: t('trainee.certificate.title') }} />

					<div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
						{/* Left Content */}
						<div className="max-w-2xl">
							<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full border border-cyan-200/60 mb-4">
								<Sparkles className="w-4 h-4 text-cyan-500" />
								<span className="text-sm font-medium text-cyan-700">Thành tựu của bạn</span>
							</div>

							<div className="text-4xl lg:text-5xl font-bold mb-4">
								<span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
									{t('trainee.certificate.title')}
								</span>
							</div>

							<p className="text-lg text-slate-600 mb-6 leading-relaxed">
								Xem và quản lý các chứng chỉ bạn đã đạt được trong quá trình đào tạo.
							</p>

							{/* Stats */}
							<div className="flex items-center gap-6">
								<div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 shadow-sm">
									<Award className="w-5 h-5 text-cyan-500" />
									<span className="font-semibold text-slate-800">{certificates.length}</span>
									<span className="text-slate-500 text-sm">chứng chỉ</span>
								</div>
							</div>
						</div>

						{/* Right: Icon Display */}
						<div className="hidden lg:flex items-center justify-center">
							<div className="relative">
								<div className="w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-3xl flex items-center justify-center shadow-xl shadow-cyan-200/50 border border-white/60">
									<Award className="w-16 h-16 text-cyan-600" />
								</div>
								<div className="absolute -bottom-2 -right-2 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
									<Sparkles className="w-6 h-6 text-white" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Content Area */}
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-10">
				{loading ? (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{Array.from({ length: 8 }).map((_, idx) => (
							<div key={idx} className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
								<div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />
								<div className="w-full h-44 overflow-hidden">
									<Skeleton.Image active className="!w-full !h-44" />
								</div>
								<div className="p-5">
									<Skeleton active title={{ width: '70%' }} paragraph={{ rows: 2, width: ['100%', '60%'] }} />
								</div>
							</div>
						))}
					</div>
				) : certificates.length === 0 ? (
					<div className="min-h-[400px] flex flex-col items-center justify-center">
						<div className="w-32 h-32 bg-gradient-to-br from-cyan-100 to-blue-200 rounded-full flex items-center justify-center mb-6 shadow-inner">
							<Award className="w-16 h-16 text-cyan-400" />
						</div>
						<p className="text-slate-700 text-xl font-semibold mb-2">{t('trainee.certificate.noCertificates')}</p>
						<p className="text-slate-500 text-sm">Hoàn thành các khóa học để nhận chứng chỉ</p>
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{certificates.map((cert) => {
							const issueDate = cert.issuedDate ? new Date(cert.issuedDate) : null;
							const expireDate = cert.expireDate ? new Date(cert.expireDate) : null;
							const statusColors = getStatusColor(cert.expireDate);
							const statusText = getStatusText(cert.expireDate);

							return (
								<Link
									key={cert.id}
									to={`/certificate/${cert.id}`}
									onClick={() => window.scrollTo({ top: 0 })}
									className="group block"
								>
									<div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 overflow-hidden shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
										{/* Cover */}
										{cert.pdfUrl ? (
											<div className="relative h-44 bg-slate-100 overflow-hidden">
												<iframe
													src={`${cert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
													className="w-full h-full pointer-events-none"
													title={t('trainee.certificate.preview')}
												/>
												<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
											</div>
										) : (
											<div className="relative h-44 bg-gradient-to-br from-cyan-500 via-blue-500 to-indigo-600 flex items-center justify-center">
												<div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
												<Award className="w-16 h-16 text-white/90" />
											</div>
										)}

										{/* Content */}
										<div className="p-5 space-y-3">
											<div>
												<h3 className="font-semibold text-slate-900 text-lg mb-1 line-clamp-2 group-hover:text-cyan-600 transition-colors">
													{cert.courseName || cert.course || 'Certificate'}
												</h3>
												<p className="text-sm text-slate-500 font-mono">
													{cert.certificateCode || cert.certificateId || 'N/A'}
												</p>
											</div>

											<div className="space-y-2 pt-3 border-t border-slate-100">
												<div className="flex items-center gap-2 text-sm text-slate-600">
													<GraduationCap className="w-4 h-4 text-cyan-500" />
													<span className="line-clamp-1">{cert.traineeName || cert.learnerName || 'N/A'}</span>
												</div>
												{issueDate && (
													<div className="flex items-center gap-2 text-sm text-slate-600">
														<Calendar className="w-4 h-4 text-cyan-500" />
														<span>{t('trainee.certificate.issued')}: {issueDate.toLocaleDateString()}</span>
													</div>
												)}
												{expireDate && (
													<div className="flex items-center gap-2 text-sm text-slate-600">
														<Calendar className="w-4 h-4 text-amber-500" />
														<span>{t('trainee.certificate.expires')}: {expireDate.toLocaleDateString()}</span>
													</div>
												)}
											</div>

											{cert.grade != null && (
												<div className="pt-3 border-t border-slate-100">
													<div className="flex items-center justify-between">
														<span className="text-sm text-slate-500">Điểm số</span>
														<div className="flex items-baseline gap-1">
															<span className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{cert.grade}</span>
															<span className="text-slate-400 text-sm">/ 100</span>
														</div>
													</div>
												</div>
											)}
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}

