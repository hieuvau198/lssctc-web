import React from 'react';
import { Card, Button, Progress } from 'antd';
import { BookOpen, CheckCircle2, Clock } from 'lucide-react';

export default function ReadingContent({ title, duration, completed = false }) {
	return (
		<div className="max-w-4xl mx-auto">
			<Card className="mb-6">
				<div className="mb-4">
					<div className="flex items-center gap-2 mb-4">
						<BookOpen className="w-5 h-5 text-blue-600" />
						<h1 className="text-2xl font-bold text-slate-900">{title}</h1>
					</div>
					
					<div className="flex items-center justify-between mb-6">
						<div className="flex items-center gap-2">
							<Clock className="w-4 h-4 text-slate-500" />
							<span className="text-sm text-slate-600">Reading time: {duration}</span>
						</div>
						
						{completed && (
							<div className="flex items-center gap-2 text-green-600">
								<CheckCircle2 className="w-4 h-4" />
								<span className="text-sm">Completed</span>
							</div>
						)}
					</div>
				</div>
				
				<div className="prose max-w-none">
					<h2>Introduction</h2>
					<p className="text-slate-700 leading-relaxed">
						This document covers essential safety protocols and operating procedures for crane operations. 
						Understanding these principles is crucial for safe and effective crane operation in various industrial settings.
					</p>
					
					<h3>Key Safety Considerations</h3>
					<ul className="text-slate-700">
						<li>Always perform pre-operation inspections</li>
						<li>Maintain proper communication with ground personnel</li>
						<li>Understand load weight limits and capacity charts</li>
						<li>Be aware of environmental conditions (wind, obstacles)</li>
						<li>Follow proper rigging procedures</li>
					</ul>
					
					<h3>Operating Procedures</h3>
					<p className="text-slate-700 leading-relaxed">
						Before beginning any lifting operation, operators must ensure all safety protocols are in place 
						and all personnel are properly positioned. The work area should be clearly marked and secured.
					</p>
					
					<h3>Emergency Procedures</h3>
					<p className="text-slate-700 leading-relaxed">
						In case of emergency, operators should immediately stop all operations and follow established 
						emergency protocols. Communication with supervision and emergency services should be prioritized.
					</p>
				</div>
				
				{!completed && (
					<div className="mt-6 pt-6 border-t">
						<Button type="primary" size="large">
							Mark as Complete
						</Button>
					</div>
				)}
			</Card>
			
			{completed && (
				<Card title="Reading Progress">
					<Progress percent={100} status="success" />
					<p className="text-sm text-slate-600 mt-2">
						You have completed this reading material.
					</p>
				</Card>
			)}
		</div>
	);
}