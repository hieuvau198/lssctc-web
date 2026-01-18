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
		<div className="bg-white flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 64px)' }}>
			{/* Hero Section - Compact Industrial Style */}
			<section className="relative bg-black text-white py-3 overflow-hidden">
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
				<div className="absolute inset-0 bg-black/70" />

				<div className="relative max-w-7xl mx-auto px-6">
					{/* Row 1: Back button + Title + Actions */}
					<div className="flex items-center justify-between gap-4">
						{/* Left: Back + Title */}
						<div className="flex items-center gap-3 min-w-0">
							<button
								onClick={() => navigate('/certificate')}
								className="h-9 w-9 border-2 border-white/40 text-white hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all flex items-center justify-center flex-shrink-0"
							>
								<ChevronLeft className="w-5 h-5" />
							</button>
							<div className="h-6 w-px bg-white/30 flex-shrink-0" />
							<span className="px-2 py-0.5 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase flex-shrink-0">
								Chứng chỉ
							</span>
							<h1 className="text-base sm:text-lg font-bold text-white truncate" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
								{cert.courseName || cert.course || 'Certificate'}
							</h1>
						</div>

						{/* Right: Actions */}
						<div className="flex items-center gap-2 flex-shrink-0">
							{cert.pdfUrl && (
								<button
									onClick={() => window.open(cert.pdfUrl, '_blank')}
									className="h-9 px-3 border-2 border-white/40 text-white text-xs font-bold uppercase tracking-wide hover:bg-yellow-400 hover:text-black hover:border-yellow-400 transition-all flex items-center gap-2 whitespace-nowrap"
								>
									<ExternalLink className="w-4 h-4" />
									<span className="hidden sm:inline">Mở tab mới</span>
								</button>
							)}
							<button
								onClick={downloadPdf}
								className="h-9 px-4 bg-yellow-400 text-black text-xs font-bold uppercase tracking-wide hover:bg-white transition-all flex items-center gap-2 whitespace-nowrap"
							>
								<Download className="w-4 h-4" />
								<span>Tải PDF</span>
							</button>
						</div>
					</div>

					{/* Row 2: Meta info */}
					<div className="flex items-center gap-4 mt-2 text-xs text-white/70">
						<span className="flex items-center gap-1.5">
							<GraduationCap className="w-3.5 h-3.5 text-yellow-400" />
							{cert.traineeName || cert.learnerName || 'N/A'}
						</span>
						{issueDate && (
							<>
								<span className="text-white/30">•</span>
								<span className="flex items-center gap-1.5">
									<Calendar className="w-3.5 h-3.5 text-yellow-400" />
									Cấp ngày: {issueDateText}
								</span>
							</>
						)}
					</div>
				</div>
			</section>

			{/* Content Area - Fill remaining space, no scroll */}
			<section className="flex-1 bg-neutral-200 flex items-center justify-center overflow-hidden p-4">
				<div className="h-full flex items-center justify-center" style={{ maxHeight: '100%' }}>
					{/* Certificate Display */}
					{cert.pdfUrl ? (
						<object
							data={`${cert.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=Fit&zoom=page-fit`}
							type="application/pdf"
							className="h-full bg-white shadow-2xl"
							style={{
								aspectRatio: '210/297',
								maxHeight: '100%',
								width: 'auto'
							}}
						>
							<p>Không thể hiển thị PDF. <a href={cert.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-yellow-600 underline">Tải xuống tại đây</a></p>
						</object>
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
			</section>
		</div>
	);
}
