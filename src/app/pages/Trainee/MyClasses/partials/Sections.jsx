import { Card, Progress, Skeleton, message } from 'antd';
import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getLearningSectionsByClassIdAndTraineeId } from '../../../../apis/Trainee/TraineeLearningApi';
import { getAuthToken } from '../../../../libs/cookies';
import { decodeToken } from '../../../../libs/jwtDecode';
import { getFirstPartitionPath } from '../../../../mocks/lessonPartitions';
import useAuthStore from '../../../../store/authStore';

export default function Sections({ classId }) {
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
				if (mounted) {
					setSections(Array.isArray(sectionsRes) ? sectionsRes : []);
				}
			} catch (err) {
				console.error('Failed to fetch sections:', err);
				if (mounted) {
					message.error('Không tải được danh sách sections');
					setSections([]);
				}
			} finally {
				if (mounted) setLoading(false);
			}
		}

		fetchSections();
		return () => { mounted = false; };
	}, [classId, traineeIdFromStore]);

	if (loading) {
		return (
			<Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
				<Skeleton active paragraph={{ rows: 4 }} />
			</Card>
		);
	}

	if (!sections || sections.length === 0) {
		return (
			<Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
				<div className="text-center text-slate-500 py-10">
					No sections available at the moment.
				</div>
			</Card>
		);
	}

	return (
		<div className="my-4">
			<Card className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
				<div className="space-y-5">
					{sections.map((section) => {
						const deepLink = getFirstPartitionPath(classId) || `/learnings/${classId}`;
						return (
							<Link key={section.sectionId} to={deepLink} className="block">
								<div className="flex items-start justify-between p-5 border border-slate-200 rounded-lg bg-slate-50/30 hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer">
									<div className="flex-1">
										<div className="flex items-start gap-3">
											<div className="flex-1">
												<div className="flex items-center justify-between gap-2 mb-1">
													<h4 className="font-semibold text-slate-900 text-base">{section.sectionName}</h4>
													<div className="mb-3 text-xs text-slate-500">
														<div className="flex items-center justify-center gap-1">
															<Clock className="w-3 h-3" />
															<span>{section.durationMinutes} mins</span>
														</div>
													</div>
												</div>
												<p className="text-sm text-slate-600 mb-3 line-clamp-2">{section.sectionDescription}</p>

												<div className="space-y-2">
													<div className="flex items-center justify-between text-sm">
														<span className="text-slate-600">Progress</span>
														<span className="font-medium text-slate-900">{section.sectionProgress}%</span>
													</div>
													<Progress
														percent={section.sectionProgress * 100}
														showInfo={false}
														size="small"
														strokeColor={section.isCompleted === true ? '#10b981' : '#0f766e'}
														trailColor="#e2e8f0"
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</Link>
						);
					})}
				</div>
			</Card>
		</div>
	);
}