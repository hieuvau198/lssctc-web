import React from 'react';
import { Card } from 'antd';

export default function CourseOverview() {
	return (
		<div className="my-4">
			<Card title="Class Overview" className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
				<p className="text-slate-600 leading-relaxed">
					This comprehensive course covers the fundamentals of seaport crane operations,
					including safety protocols, load management, and operational efficiency.
					Students will learn through interactive simulations and hands-on practice.
				</p>
			</Card>
		</div>
	);
}