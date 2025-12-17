import { useEffect, useState } from 'react';
import { Empty, Skeleton, message } from 'antd';
import { Award, Calendar, GraduationCap, ChevronRight } from 'lucide-react';
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
		if (!expireDate) return { bg: 'bg-yellow-400', text: 'text-black' };
		const exp = new Date(expireDate);
		const now = new Date();
		if (exp < now) return { bg: 'bg-red-500', text: 'text-white' };
		const daysLeft = Math.floor((exp - now) / (1000 * 60 * 60 * 24));
		if (daysLeft < 90) return { bg: 'bg-amber-500', text: 'text-white' };
		return { bg: 'bg-yellow-400', text: 'text-black' };
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
		<div className="min-h-screen bg-white">
			{/* Hero Section - Industrial Style */}
			<section className="relative bg-black text-white py-12 overflow-hidden">
				<div className="absolute inset-0">
					<img
						src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=2070&auto=format&fit=crop"
						onError={(e) => {
							e.target.onerror = null;
							e.target.src = "/images/crane-background.jpg";
						}}
						alt=""
						className="w-full h-full object-cover"
					/>
				</div>
				<div className="absolute inset-0 bg-black/60" />

				<div className="relative max-w-7xl mx-auto px-6">
					<PageNav
						nameMap={{ certificate: t('trainee.certificate.title') }}
						className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
					/>

					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
						{/* Left Content */}
						<div className="max-w-2xl">
							<div className="mb-4 flex items-center gap-4">
								<span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
									LSSCTC ACADEMY
								</span>
								<span className="h-1 w-1 rounded-full bg-yellow-400" />
								<span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
									Thành tựu
								</span>
							</div>

							<h1 className="text-4xl lg:text-5xl font-black uppercase tracking-tight mb-4 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
								{t('trainee.certificate.title')}
							</h1>

							<p className="text-lg text-white max-w-xl mb-6 leading-relaxed font-medium drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
								Xem và quản lý các chứng chỉ bạn đã đạt được trong quá trình đào tạo.
							</p>

							{/* Stats */}
							<div className="flex items-center gap-3">
								<div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3">
									<div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
										<Award className="w-5 h-5 text-black" />
									</div>
									<div>
										<div className="text-2xl font-black text-white">{certificates.length}</div>
										<div className="text-xs text-yellow-400 uppercase tracking-wider font-semibold">Chứng chỉ</div>
									</div>
								</div>
							</div>
						</div>

						{/* Right: Icon Display */}
						<div className="hidden lg:flex items-center justify-center">
							<div className="w-32 h-32 bg-yellow-400 flex items-center justify-center">
								<Award className="w-16 h-16 text-black" />
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Content Area */}
			<section className="py-12 bg-neutral-50 border-y border-neutral-200">
				<div className="max-w-7xl mx-auto px-6">
					{/* Section Header */}
					<div className="mb-10">
						<span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
							Danh sách
						</span>
						<h2 className="text-4xl font-black uppercase tracking-tight mb-2">
							Chứng chỉ của bạn
						</h2>
						<div className="h-1 w-24 bg-yellow-400" />
					</div>

					{loading ? (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{Array.from({ length: 8 }).map((_, idx) => (
								<div key={idx} className="bg-white border-2 border-neutral-900 overflow-hidden">
									<div className="h-2 bg-neutral-200" />
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
							<div className="w-24 h-24 bg-neutral-200 flex items-center justify-center mb-6">
								<Award className="w-12 h-12 text-neutral-400" />
							</div>
							<p className="text-neutral-900 text-xl font-black uppercase mb-2">{t('trainee.certificate.noCertificates')}</p>
							<p className="text-neutral-500 text-sm">Hoàn thành các khóa học để nhận chứng chỉ</p>
						</div>
					) : (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{certificates.map((cert, index) => {
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
										<div className="bg-white border-2 border-neutral-900 hover:border-yellow-400 overflow-hidden transition-all duration-300">
											{/* Status bar */}
											<div className={`h-2 ${statusColors.bg}`} />

											{/* Cover */}
											{cert.pdfUrl ? (
												<div className="relative h-44 bg-neutral-100 overflow-hidden">
													<iframe
														src={`${cert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
														className="w-full h-full pointer-events-none"
														title={t('trainee.certificate.preview')}
													/>
													<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
												</div>
											) : (
												<div className="relative h-44 bg-neutral-900 flex items-center justify-center">
													<Award className="w-16 h-16 text-yellow-400" />
												</div>
											)}

											{/* Content */}
											<div className="p-5">
												{/* Title & Code */}
												<div className="mb-3">
													<h3 className="font-black uppercase text-neutral-900 text-lg mb-1 line-clamp-2 group-hover:text-yellow-600 transition-colors">
														{cert.courseName || cert.course || 'Certificate'}
													</h3>
													<p className="text-xs font-bold tracking-widest text-neutral-500 uppercase">
														{cert.certificateCode || cert.certificateId || 'N/A'}
													</p>
												</div>

												{/* Meta */}
												<div className="space-y-2 pt-3 border-t border-neutral-200">
													<div className="flex items-center gap-2 text-sm text-neutral-600">
														<GraduationCap className="w-4 h-4 text-yellow-500" />
														<span className="line-clamp-1 uppercase tracking-wider text-xs font-semibold">{cert.traineeName || cert.learnerName || 'N/A'}</span>
													</div>
													{issueDate && (
														<div className="flex items-center gap-2 text-sm text-neutral-600">
															<Calendar className="w-4 h-4 text-yellow-500" />
															<span className="uppercase tracking-wider text-xs font-semibold">{t('trainee.certificate.issued')}: {issueDate.toLocaleDateString()}</span>
														</div>
													)}
												</div>

												{/* Status & Grade */}
												<div className="pt-3 mt-3 border-t border-neutral-200 flex items-center justify-between">
													<span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${statusColors.bg} ${statusColors.text}`}>
														{statusText}
													</span>
													{cert.grade != null && (
														<div className="flex items-baseline gap-1">
															<span className="text-2xl font-black text-neutral-900">{cert.grade}</span>
															<span className="text-neutral-400 text-xs font-bold">/100</span>
														</div>
													)}
												</div>
											</div>
										</div>
									</Link>
								);
							})}
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
