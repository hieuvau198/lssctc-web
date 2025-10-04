import React from 'react';
import { Card } from 'antd';
import { Calendar } from 'lucide-react';

export default function ClassSchedule({ classData }) {
	return (
		<Card title="Class Schedule" className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
			<div className="space-y-3">
				<div className="flex items-center gap-2 text-sm text-slate-600">
					<Calendar className="w-4 h-4" />
					<span>Start Date: {classData.startDate || 'Sep 1, 2025'}</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-slate-600">
					<Calendar className="w-4 h-4" />
					<span>End Date: {classData.endDate || 'Nov 30, 2025'}</span>
				</div>
			</div>
		</Card>
	);
}