import { Empty, Skeleton } from 'antd';
import { Clock, BookOpen, ChevronRight, CheckCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLearningSectionsByClassIdAndTraineeId, getActivityRecordsByClassAndSection } from '../../../../apis/Trainee/TraineeLearningApi';
import { getAuthToken } from '../../../../libs/cookies';
import { decodeToken } from '../../../../libs/jwtDecode';
import { getFirstPartitionPath } from '../../../../mocks/lessonPartitions';
import useAuthStore from '../../../../store/authStore';
import { message } from 'antd';

export default function Sections({ classId }) {
	const { t } = useTranslation();
	const authState = useAuthStore();
	const traineeIdFromStore = authState.nameid;
	const [sections, setSections] = useState([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let mounted = true;
		async function fetchSections() {
			if (!classId) return;

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
				const sectionsRes = await getLearningSectionsByClassIdAndTraineeId(classId, resolvedTraineeId);

				// Fetch first activity for each section
				const sectionsWithActivities = await Promise.all(
					sectionsRes.map(async (section) => {
						try {
							const activities = await getActivityRecordsByClassAndSection(classId, section.sectionId);
							const firstActivity = activities && activities.length > 0 ? activities[0] : null;
							return { ...section, firstActivity };
						} catch (err) {
							console.error(`Failed to fetch activities for section ${section.sectionId}:`, err);
							return { ...section, firstActivity: null };
						}
					})
				);

				if (mounted) {
					setSections(Array.isArray(sectionsWithActivities) ? sectionsWithActivities : []);
				}
			} catch (err) {
				console.error('Failed to fetch sections:', err);
				if (mounted) {
					message.error(t('trainee.sections.loadFailed'));
					setSections([]);
				}
			} finally {
				if (mounted) setLoading(false);
			}
		}

		fetchSections();
		return () => { mounted = false; };
	}, [classId, traineeIdFromStore, t]);

	if (loading) {
		return (
			<div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-6 shadow-lg shadow-slate-200/50">
				<Skeleton active paragraph={{ rows: 4 }} />
			</div>
		);
	}

	if (!sections || sections.length === 0) {
		return (
			<div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-8 shadow-lg shadow-slate-200/50">
				<div className="flex flex-col items-center justify-center py-8">
					<div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-50 rounded-full flex items-center justify-center mb-4 shadow-inner">
						<BookOpen className="w-8 h-8 text-slate-400" />
					</div>
					<p className="text-slate-500 font-medium">{t('trainee.sections.noSections')}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{sections.map((section, index) => {
				// Build link to first activity of this section
				const deepLink = section.firstActivity
					? `/learnings/${classId}/${section.sectionId}/${section.firstActivity.activityId}`
					: getFirstPartitionPath(classId) || `/learnings/${classId}`;

				const isCompleted = section.sectionProgress >= 100;

				return (
					<Link key={section.sectionId} to={deepLink} className="block group">
						<div className="relative bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/10 hover:border-cyan-300/50 hover:scale-[1.01]">
							{/* Gradient Top Bar */}
							<div className={`h-1 ${isCompleted ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500'}`} />

							<div className="p-5">
								<div className="flex items-start justify-between gap-4">
									<div className="flex-1 min-w-0">
										{/* Section Header */}
										<div className="flex items-center gap-3 mb-2">
											<span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-xs font-medium">
												{t('trainee.sections.lesson')} {index + 1}
											</span>
											<div className="flex items-center gap-1 text-slate-400 text-xs">
												<Clock className="w-3.5 h-3.5" />
												<span>{section.durationMinutes} {t('trainee.sections.mins')}</span>
											</div>
											{isCompleted && (
												<span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-medium">
													<CheckCircle className="w-3 h-3" />
													{t('trainee.sections.completed')}
												</span>
											)}
										</div>

										{/* Section Title */}
										<h4 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-cyan-600 transition-colors duration-300">
											{section.sectionName}
										</h4>

										{/* Description */}
										<p className="text-sm text-slate-500 mb-4 line-clamp-2">
											{section.sectionDescription}
										</p>

										{/* Progress Bar */}
										<div className="space-y-2">
											<div className="flex items-center justify-between text-sm">
												<span className="text-slate-500 font-medium">{t('trainee.sections.progress')}</span>
												<span className={`font-bold ${isCompleted ? 'text-emerald-600' : 'bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent'}`}>
													{section.sectionProgress}%
												</span>
											</div>
											<div className="h-2 bg-slate-100 rounded-full overflow-hidden">
												<div
													className={`h-full rounded-full transition-all duration-500 ${isCompleted ? 'bg-gradient-to-r from-emerald-400 to-teal-500' : 'bg-gradient-to-r from-cyan-400 to-blue-500'}`}
													style={{ width: `${section.sectionProgress}%` }}
												/>
											</div>
										</div>
									</div>

									{/* Arrow Icon */}
									<div className="flex-shrink-0 w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500 flex items-center justify-center transition-all duration-300">
										<ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors duration-300" />
									</div>
								</div>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
}
