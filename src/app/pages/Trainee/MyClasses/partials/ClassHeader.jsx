import { BookOpen, Clock, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getClassStatus } from '../../../../utils/classStatus';

export default function ClassHeader({ classData }) {
	const { t } = useTranslation();
	if (!classData) return null;

	const status = getClassStatus(classData.status ?? classData._statusMapped);

	return (
		<div className="relative bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-lg overflow-hidden shadow-lg shadow-slate-200/50 mb-6">
			{/* Gradient Top Bar */}
			<div className="h-1.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500" />

			<div className="p-6">
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div className="flex-1">
						{/* Provider & Status */}
						<div className="flex items-center gap-3 flex-wrap mb-2">
							<span className="text-sm text-slate-500 font-medium">LSSCTC Academy</span>
							<span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color === 'green' ? 'bg-emerald-100 text-emerald-700' :
									status.color === 'blue' ? 'bg-blue-100 text-blue-700' :
										status.color === 'orange' ? 'bg-amber-100 text-amber-700' :
											'bg-slate-100 text-slate-600'
								}`}>
								{status.label}
							</span>
						</div>

						{/* Class Name */}
						<h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-600 bg-clip-text text-transparent leading-tight mb-4">
							{classData.name}
						</h1>

						{/* Stats */}
						<div className="flex items-center gap-6 flex-wrap">
							<div className="flex items-center gap-2 text-sm">
								<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100/80 flex items-center justify-center">
									<Users className="w-4 h-4 text-cyan-600" />
								</div>
								<span className="text-slate-600">{classData.capacity} {t('trainee.myClassDetail.students')}</span>
							</div>
							<div className="flex items-center gap-2 text-sm">
								<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/80 flex items-center justify-center">
									<Clock className="w-4 h-4 text-blue-600" />
								</div>
								<span className="text-slate-600">{classData.courseDurationHours} {t('trainee.myClassDetail.hrs')}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
