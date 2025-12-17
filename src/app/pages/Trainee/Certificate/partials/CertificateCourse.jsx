import { useEffect, useState } from 'react';
import { Divider, Skeleton, message } from 'antd';
import { Award, Download, ExternalLink, ChevronLeft, Calendar, GraduationCap, FileText } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import PageNav from '../../../../components/PageNav/PageNav';
import { getTraineeCertificateById } from '../../../../apis/Trainee/TraineeCertificateApi';

export default function CertificateCourse() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [cert, setCert] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let mounted = true;
		async function fetchCertificate() {
			if (!id) return;

			setLoading(true);
			try {
				const data = await getTraineeCertificateById(id);
				if (mounted) {
					setCert(data);
				}
			} catch (err) {
				console.error('Failed to fetch certificate:', err);
				if (mounted) {
					message.error('Failed to load certificate');
					navigate('/certificate');
				}
			} finally {
				if (mounted) setLoading(false);
			}
		}

		fetchCertificate();
		return () => { mounted = false; };
	}, [id, navigate]);

	const downloadPdf = () => {
		if (cert?.pdfUrl) {
			window.open(cert.pdfUrl, '_blank');
		} else {
			window.print();
		}
	};

	if (loading) {
		return (
			<div className="min-h-screen bg-white">
				<div className="max-w-7xl mx-auto px-6 py-8">
					<PageNav items={[{ title: 'Certificates', href: '/certificate' }, { title: 'Loading...' }]} />
					<div className="mt-6">
						<div className="bg-white border-2 border-neutral-900 p-8">
							<Skeleton active paragraph={{ rows: 8 }} />
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!cert) {
		return null;
	}

	const issueDate = cert.issuedDate ? new Date(cert.issuedDate) : null;
	const expireDate = cert.expireDate ? new Date(cert.expireDate) : null;
	const issueDateText = issueDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
	const expireDateText = expireDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

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
						items={[{ title: 'Certificates', href: '/certificate' }, { title: cert.courseName || 'Certificate' }]}
						className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
					/>

					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						{/* Left Content */}
						<div className="flex-1">
							<div className="mb-4 flex items-center gap-4">
								<span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
									LSSCTC ACADEMY
								</span>
								<span className="h-1 w-1 rounded-full bg-yellow-400" />
								<span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
									Chứng chỉ
								</span>
							</div>

							<h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tight mb-3 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
								{cert.courseName || cert.course || 'Certificate'}
							</h1>

							<p className="text-sm font-bold tracking-widest text-white/80 uppercase mb-4">
								{cert.certificateCode || cert.certificateId || 'N/A'}
							</p>

							{/* Meta info */}
							<div className="flex flex-wrap items-center gap-4 text-sm text-white">
								<div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2">
									<GraduationCap className="w-4 h-4 text-yellow-400" />
									<span>{cert.traineeName || cert.learnerName || 'N/A'}</span>
								</div>
								{issueDate && (
									<div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2">
										<Calendar className="w-4 h-4 text-yellow-400" />
										<span>Cấp ngày: {issueDateText}</span>
									</div>
								)}
								{expireDate && (
									<div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-2">
										<Calendar className="w-4 h-4 text-amber-400" />
										<span>Hết hạn: {expireDateText}</span>
									</div>
								)}
							</div>
						</div>

						{/* Right: Action Buttons */}
						<div className="flex items-center gap-3">
							<button
								onClick={() => navigate('/certificate')}
								className="h-12 px-6 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all flex items-center gap-2"
							>
								<ChevronLeft className="w-5 h-5" />
								Quay lại
							</button>
							{cert.pdfUrl && (
								<button
									onClick={() => window.open(cert.pdfUrl, '_blank')}
									className="h-12 px-6 border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all flex items-center gap-2"
								>
									<ExternalLink className="w-5 h-5" />
									Mở tab mới
								</button>
							)}
							<button
								onClick={downloadPdf}
								className="h-12 px-6 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-white transition-all flex items-center gap-2"
							>
								<Download className="w-5 h-5" />
								Tải PDF
							</button>
						</div>
					</div>
				</div>
			</section>

			{/* Content Area */}
			<section className="py-10 bg-neutral-50 border-y border-neutral-200">
				<div className="max-w-7xl mx-auto px-6">
					<div className="bg-white border-4 border-neutral-900 overflow-hidden">
						{cert.pdfUrl ? (
							<div className="p-4">
								<iframe
									src={cert.pdfUrl}
									className="w-full h-[800px] border-0"
									title="Certificate PDF"
								/>
							</div>
						) : (
							<div className="relative">
								{/* Certificate Display */}
								<div className="p-10 print-area">
									<div className="border-4 border-neutral-900 p-10 bg-white">
										{/* Yellow accent */}
										<div className="h-2 bg-yellow-400 -mx-10 -mt-10 mb-8" />

										{/* Header */}
										<div className="flex flex-col items-center justify-center gap-4 mb-8 text-center">
											<div className="w-20 h-20 bg-yellow-400 flex items-center justify-center">
												<Award className="w-10 h-10 text-black" />
											</div>
											<h2 className="text-3xl sm:text-4xl font-black uppercase tracking-wider text-neutral-900">
												Certificate of Completion
											</h2>
										</div>

										<p className="text-center text-neutral-500 mb-8 text-lg uppercase tracking-wider">This is to certify that</p>

										{/* Content */}
										<div className="text-center space-y-6">
											<div className="text-3xl sm:text-4xl font-black uppercase text-neutral-900">
												{cert.traineeName || cert.learnerName || 'N/A'}
											</div>

											<p className="text-neutral-600 text-lg uppercase tracking-wider">has successfully completed</p>

											<div className="text-2xl sm:text-3xl font-black uppercase text-neutral-800">
												{cert.courseName || cert.course || 'N/A'}
											</div>

											<div className="flex justify-center items-center gap-4 flex-wrap">
												{issueDateText && (
													<span className="px-4 py-2 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm">
														{issueDateText}
													</span>
												)}
												{expireDateText && (
													<span className="px-4 py-2 bg-neutral-200 text-neutral-700 font-bold uppercase tracking-wider text-sm">
														valid until {expireDateText}
													</span>
												)}
											</div>

											{cert.grade != null && (
												<div className="pt-4">
													<span className="text-neutral-500 uppercase tracking-wider">Score: </span>
													<span className="text-4xl font-black text-neutral-900">
														{cert.grade}
													</span>
													<span className="text-neutral-400 ml-1">/100</span>
												</div>
											)}
										</div>

										<Divider className="!my-10 !border-neutral-300" />

										{/* Footer */}
										<div className="flex items-end justify-between">
											<div className="text-sm text-neutral-600">
												<div className="flex items-center gap-2 mb-1">
													<FileText className="w-4 h-4 text-yellow-500" />
													<span className="uppercase tracking-wider font-semibold">Certificate ID</span>
												</div>
												<div className="font-black text-neutral-900 font-mono">
													{cert.certificateCode || cert.certificateId || 'N/A'}
												</div>
											</div>
											<div className="text-center">
												<div className="h-12" />
												<div className="border-t-4 border-neutral-900 pt-2 px-8">
													<div className="text-sm font-black uppercase text-neutral-900">
														{cert.issuerName || 'Training Director'}
													</div>
													<div className="text-xs text-neutral-500 uppercase tracking-wider">
														{cert.issuerTitle || 'Authorized Signatory'}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
		</div>
	);
}
