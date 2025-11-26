import { Card, Tag } from 'antd';
import { BookOpen, Clock, Users } from 'lucide-react';
import { getClassStatus } from '../../../../utils/classStatus';

export default function ClassHeader({ classData }) {
	if (!classData) return null;

	return (
		<Card className="rounded-2xl overflow-hidden relative mb-8 shadow-lg">
			<div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r opacity-80 from-transparent via-slate-200 to-transparent" />
			<div className="flex">
				<div className="flex-1">
					<div className="flex items-start gap-4">
						<div className="flex-1">
							<div className="flex items-center gap-2 flex-wrap mb-2">
								<div className="text-sm text-slate-500">{"LSSCTC Academy"}</div>
								{(() => {
									const s = getClassStatus(classData.status ?? classData._statusMapped);
									return (
										<Tag color={s.color} className="text-xs uppercase tracking-wide font-semibold m-0">
											{s.label}
										</Tag>
									);
								})()}
							</div>
							<h1 className="text-2xl font-bold text-slate-900 leading-tight mb-3">
								{classData.name}
							</h1>
							<div className="flex items-center gap-6 text-sm text-slate-600 mb-4">
								<div className="flex items-center gap-2">
									<Users className="w-4 h-4" />
									<span>{classData.capacity} students</span>
								</div>
								<div className="flex items-center gap-2">
									<Clock className="w-4 h-4" />
									<span>{classData.courseDurationHours} hrs</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}