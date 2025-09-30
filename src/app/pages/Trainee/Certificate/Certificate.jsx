import React from 'react';
import { Button, Card, Divider } from 'antd';
import { Award, Download } from 'lucide-react';
import PageNav from '../../../components/PageNav/PageNav';

export default function CertificateView() {
	const cert = {
		learnerName: 'Nguyen Van A',
		certificateId: 'LSS-2025-0001',
		course: 'Seaport Crane Basic',
		issueDate: new Date('2025-09-10'),
		expireDate: new Date('2027-09-10'),
		issuerName: 'John Anderson',
		issuerTitle: 'Training Director',
		grade: 92,
	};

	const issueDateText = cert.issueDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });
	const expireDateText = cert.expireDate?.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' });

	const downloadPdf = () => {
		window.print();
	};

	return (
		<div className="max-w-7xl mx-auto px-4 py-6 min-h-screen flex flex-col">
			<PageNav nameMap={{ certificate: 'Certificate' }} />
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
							<div className="text-2xl sm:text-3xl font-semibold text-slate-900">{cert.learnerName}</div>
							<p className="text-slate-600 mt-2">has successfully completed</p>
							<div className="text-xl sm:text-2xl font-medium text-blue-700">{cert.course}</div>
							<p className="text-slate-600 mt-2">
								on <span className="font-medium text-slate-800">{issueDateText}</span>
								{expireDateText ? (
									<>
										{' '}• valid until <span className="font-medium text-slate-800">{expireDateText}</span>
									</>
								) : null}
							</p>
							{cert.grade != null && (
								<p className="text-slate-700">Score: <span className="font-semibold">{cert.grade}</span></p>
							)}
						</div>

						<Divider className="!my-8" />
						<div className="flex items-end justify-between">
							<div className="text-sm text-slate-600">
								Certificate ID
								<div className="font-semibold text-slate-800">{cert.certificateId}</div>
							</div>
							<div className="text-center">
								<div className="h-12" />
								<div className="border-t border-slate-300 pt-1 text-sm text-slate-700">
									{cert.issuerName}
									<div className="text-slate-500">{cert.issuerTitle}</div>
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

