import { useEffect, useState } from 'react';
import { Button, Divider, Skeleton, message } from 'antd';
import { Award, Download, ExternalLink, ArrowLeft, Calendar, GraduationCap, FileText, Sparkles } from 'lucide-react';
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
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
				<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-8">
					<PageNav items={[{ title: 'Certificates', href: '/certificate' }, { title: 'Loading...' }]} />
					<div className="mt-6">
						<div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg p-8">
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
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50/30">
			{/* Hero Section */}
			<div className="relative bg-gradient-to-br from-cyan-50/80 via-blue-50/50 to-white border-b border-slate-200/60 overflow-hidden">
				{/* Decorative Blurs */}
				<div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
				<div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

				<div className="relative max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-8">
					<PageNav items={[{ title: 'Certificates', href: '/certificate' }, { title: cert.courseName || 'Certificate' }]} />

					<div className="mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
						{/* Left Content */}
						<div className="flex-1">
							<div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full border border-cyan-200/60 mb-4">
								<Sparkles className="w-4 h-4 text-cyan-500" />
								<span className="text-sm font-medium text-cyan-700">Chứng chỉ hoàn thành</span>
							</div>

							<h1 className="text-3xl lg:text-4xl font-bold mb-3">
								<span className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent">
									{cert.courseName || cert.course || 'Certificate'}
								</span>
							</h1>

							<p className="text-slate-500 font-mono text-sm mb-4">
								{cert.certificateCode || cert.certificateId || 'N/A'}
							</p>

							{/* Meta info */}
							<div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
								<div className="flex items-center gap-2">
									<GraduationCap className="w-4 h-4 text-cyan-500" />
									<span>{cert.traineeName || cert.learnerName || 'N/A'}</span>
								</div>
								{issueDate && (
									<div className="flex items-center gap-2">
										<Calendar className="w-4 h-4 text-cyan-500" />
										<span>Cấp ngày: {issueDateText}</span>
									</div>
								)}
								{expireDate && (
									<div className="flex items-center gap-2">
										<Calendar className="w-4 h-4 text-amber-500" />
										<span>Hết hạn: {expireDateText}</span>
									</div>
								)}
							</div>
						</div>

						{/* Right: Action Buttons */}
						<div className="flex items-center gap-3">
							<Button
								icon={<ArrowLeft className="w-4 h-4" />}
								onClick={() => navigate('/certificate')}
								className="!h-10 !px-4 !rounded-xl !border-slate-200 hover:!border-cyan-400 hover:!text-cyan-600"
							>
								Quay lại
							</Button>
							{cert.pdfUrl && (
								<Button
									icon={<ExternalLink className="w-4 h-4" />}
									onClick={() => window.open(cert.pdfUrl, '_blank')}
									className="!h-10 !px-4 !rounded-xl !border-slate-200 hover:!border-cyan-400 hover:!text-cyan-600"
								>
									Mở tab mới
								</Button>
							)}
							<Button
								type="primary"
								icon={<Download className="w-4 h-4" />}
								onClick={downloadPdf}
								className="!h-10 !px-5 !rounded-xl !bg-gradient-to-r !from-cyan-500 !to-blue-600 !border-none hover:!opacity-90"
							>
								Tải xuống PDF
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Content Area */}
			<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-5 py-8">
				<div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl overflow-hidden">
					{cert.pdfUrl ? (
						<div className="p-4">
							<iframe
								src={cert.pdfUrl}
								className="w-full h-[800px] border-0 rounded-xl shadow-inner"
								title="Certificate PDF"
							/>
						</div>
					) : (
						<div className="relative">
							{/* Decorative background */}
							<div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-50 rounded-full blur-3xl" />
							<div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-50 rounded-full blur-3xl" />

							<div className="relative p-10 print-area">
								<div className="border-2 border-slate-200 rounded-3xl p-10 bg-gradient-to-br from-white via-white to-cyan-50/30">
									{/* Header */}
									<div className="flex flex-col items-center justify-center gap-4 mb-8 text-center">
										<div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
											<Award className="w-10 h-10 text-white" />
										</div>
										<h2 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
											Certificate of Completion
										</h2>
									</div>

									<p className="text-center text-slate-500 mb-8 text-lg">This is to certify that</p>

									{/* Content */}
									<div className="text-center space-y-6">
										<div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
											{cert.traineeName || cert.learnerName || 'N/A'}
										</div>

										<p className="text-slate-600 text-lg">has successfully completed</p>

										<div className="text-2xl sm:text-3xl font-semibold text-slate-800">
											{cert.courseName || cert.course || 'N/A'}
										</div>

										<div className="flex justify-center items-center gap-4 text-slate-600 flex-wrap">
											{issueDateText && (
												<span className="px-4 py-2 bg-slate-100 rounded-full">
													on <span className="font-medium text-slate-800">{issueDateText}</span>
												</span>
											)}
											{expireDateText && (
												<span className="px-4 py-2 bg-amber-50 rounded-full text-amber-700">
													valid until <span className="font-medium">{expireDateText}</span>
												</span>
											)}
										</div>

										{cert.grade != null && (
											<div className="pt-4">
												<span className="text-slate-500">Score: </span>
												<span className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
													{cert.grade}
												</span>
												<span className="text-slate-400 ml-1">/ 100</span>
											</div>
										)}
									</div>

									<Divider className="!my-10" />

									{/* Footer */}
									<div className="flex items-end justify-between">
										<div className="text-sm text-slate-600">
											<div className="flex items-center gap-2 mb-1">
												<FileText className="w-4 h-4 text-cyan-500" />
												<span>Certificate ID</span>
											</div>
											<div className="font-semibold text-slate-800 font-mono">
												{cert.certificateCode || cert.certificateId || 'N/A'}
											</div>
										</div>
										<div className="text-center">
											<div className="h-12" />
											<div className="border-t-2 border-slate-300 pt-2 px-8">
												<div className="text-sm font-medium text-slate-700">
													{cert.issuerName || 'Training Director'}
												</div>
												<div className="text-xs text-slate-500">
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
		</div>
	);
}

