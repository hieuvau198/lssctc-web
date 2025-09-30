import React, { useState, useEffect, useMemo } from 'react';
import { Card, Skeleton, Tag, Progress, Empty, Segmented, Tooltip } from 'antd';
import { ArrowRight, BookOpen, Clock } from 'lucide-react';
import PageNav from '../../../components/PageNav/PageNav';

// NOTE: Using mock data (no API) per request. Replace with real fetch later.
export default function MyProgram() {
	const [tab, setTab] = useState('in-progress'); // 'in-progress' | 'completed'
	const [programs, setPrograms] = useState([]);
	const [loading, setLoading] = useState(true);

	// Rich mock dataset
	const mockInProgress = useMemo(() => ([
		{
			id: 101,
			provider: 'Global Crane Academy',
			name: 'Seaport Crane Operations Fundamentals',
			progress: 22,
			badge: 'Foundational',
			color: 'from-cyan-500 to-blue-600',
			upNextTitle: 'Safety Clearance Zones',
			upNextType: 'Reading',
			upNextDuration: 6,
		},
		{
			id: 102,
			provider: 'Logistics Institute',
			name: 'Container Yard Workflow & Optimization',
			progress: 48,
			badge: 'Applied',
			color: 'from-violet-500 to-indigo-600',
			upNextTitle: 'Stacking Efficiency Quiz',
			upNextType: 'Quiz',
			upNextDuration: 12,
		},
		{
			id: 103,
			provider: 'Global Crane Academy',
			name: 'Advanced Load Balancing & Swing Control',
			progress: 73,
			badge: 'Advanced',
			color: 'from-amber-500 to-orange-600',
			upNextTitle: 'Sim Practice: Crosswind Handling',
			upNextType: 'Simulation',
			upNextDuration: 18,
		},
	]), []);

	const mockCompleted = useMemo(() => ([
		{
			id: 201,
			provider: 'Harbor Skills Lab',
			name: 'Intro to Maritime Logistics',
			progress: 100,
			badge: 'Completed',
			color: 'from-emerald-500 to-teal-600',
			completedAt: '2025-09-15'
		},
		{
			id: 202,
			provider: 'Safety Board Intl.',
			name: 'Equipment Inspection Certification',
			progress: 100,
			badge: 'Certified',
			color: 'from-sky-500 to-blue-600',
			completedAt: '2025-08-30'
		}
	]), []);

	useEffect(() => {
		setLoading(true);
		const t = setTimeout(() => {
			setPrograms(tab === 'completed' ? mockCompleted : mockInProgress);
			setLoading(false);
		}, 550);
		return () => clearTimeout(t);
	}, [tab, mockCompleted, mockInProgress]);

	return (
		<div className="max-w-7xl mx-auto px-4 py-8">
			<PageNav nameMap={{ 'my-program': 'My Program' }} />
			<div className="flex flex-col lg:flex-row gap-8 mt-2">
				{/* Left Column: Program List */}
				<div className="flex-1 space-y-6">
					<div>
						<h1 className="text-2xl font-semibold text-slate-900 mb-4">My Learning</h1>
						<Segmented
							options={[
								{ label: 'In Progress', value: 'in-progress' },
								{ label: 'Completed', value: 'completed' },
							]}
							value={tab}
							onChange={setTab}
							className="bg-slate-100"/>
					</div>

					{loading && (
						<div className="space-y-4">
							{Array.from({ length: 3 }).map((_, i) => (
								<Card key={i} className="rounded-xl shadow-sm">
									<Skeleton active paragraph={{ rows: 2 }} />
									<div className="mt-4"><Skeleton.Input active className="!w-full" /></div>
								</Card>
							))}
						</div>
					)}

								{!loading && programs.length === 0 && (
						<Empty description="No programs" className="py-16" />
					)}

								{!loading && programs.length > 0 && (
						<div className="space-y-6">
							{programs.map(p => (
											<Card
												key={p.id}
												className="group rounded-2xl border border-slate-200 hover:shadow-lg transition bg-gradient-to-tr from-white to-slate-50 overflow-hidden relative"
												bodyStyle={{ padding: 0 }}
											>
												<div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-80 from-transparent via-slate-200 to-transparent" />
												<div className="flex flex-col md:flex-row md:items-stretch">
													{/* Accent bar */}
													<div className={`w-full md:w-2 rounded-t-2xl md:rounded-tr-none md:rounded-l-2xl bg-gradient-to-b md:bg-gradient-to-b ${p.color} md:min-h-full`} />
													<div className="flex-1 p-5 md:p-6 flex flex-col md:flex-row md:gap-8">
														<div className="flex-1">
															<div className="flex items-start gap-3">
																<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 flex items-center justify-center text-[11px] font-semibold text-slate-700 shadow-inner">
																	{(p.provider || 'GC').split(' ').map(w=>w[0]).slice(0,2).join('').toUpperCase()}
																</div>
																<div>
																	<div className="flex items-center gap-2 flex-wrap">
																		<div className="text-xs text-slate-500 mb-0.5">{p.provider}</div>
																		{p.badge && (
																			<span className="text-[10px] uppercase tracking-wide font-semibold bg-slate-900 text-white px-2 py-0.5 rounded-full">
																				{p.badge}
																			</span>
																		)}
																	</div>
																	<h3 className="text-base font-semibold text-slate-900 leading-snug m-0 line-clamp-2 group-hover:text-slate-700 transition">
																		{p.name}
																	</h3>
																	<div className="mt-1 flex items-center gap-2 text-[11px] font-medium text-slate-600">
																		<BookOpen className="w-3.5 h-3.5" />
																		<span>{p.progress}% complete</span>
																	</div>
																</div>
															</div>
															<div className="mt-4">
																<Progress percent={p.progress} showInfo={false} strokeColor="#0f766e" trailColor="#e2e8f0" />
															</div>
														</div>
														{/* Right pane */}
														<div className="mt-4 md:mt-0 md:w-80 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
															<div>
																<div className="font-medium text-slate-800 mb-1 line-clamp-2">
																	{p.upNextTitle || 'Continue your learning'}
																</div>
																<div className="text-xs text-slate-600 flex items-center gap-2">
																	<span className="inline-flex items-center gap-1">
																		<Clock className="w-3.5 h-3.5" />
																		{p.upNextDuration || 0} min
																	</span>
																	<span className="text-slate-400">•</span>
																	<span>{p.upNextType || 'Activity'}</span>
																</div>
															</div>
															<div className="mt-4">
																{p.progress < 100 ? (
																	<button className="group/resume w-full inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-md bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-300">
																		<span>Resume</span>
																		<ArrowRight className="w-4 h-4 transition-transform group-hover/resume:translate-x-0.5" />
																	</button>
																) : (
																	<Tag color="green" className="m-0">Completed</Tag>
																)}
															</div>
														</div>
													</div>
												</div>
												</Card>
							))}
						</div>
					)}
				</div>

				{/* Right Column: Sidebar */}
				<aside className="w-full lg:w-80 space-y-6">
					<Card className="rounded-2xl">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-2xl font-bold">P</div>
							<div>
								<h4 className="text-lg font-semibold text-slate-900 m-0">Good morning, Learner</h4>
								<p className="text-xs text-slate-600 mt-1 leading-snug max-w-[220px]">Keep up the momentum! Resume a program to continue your progress.</p>
							</div>
						</div>
					</Card>
					<Card className="rounded-2xl">
						<h5 className="text-sm font-semibold text-slate-900 mb-1">Learning plan</h5>
						<p className="text-xs text-slate-600 mb-4 leading-relaxed">Learners with a plan are more likely to complete their courses. Set a plan now to guide your journey.</p>
						<button className="inline-flex items-center justify-center px-4 h-9 rounded-md border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300">
							Set your learning plan
						</button>
					</Card>
				</aside>
			</div>
		</div>
	);
}

