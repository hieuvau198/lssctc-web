import React from 'react';
import { Card, Divider, Tag } from 'antd';
import { Mail, Phone } from 'lucide-react';

export default function InstructorInfo({ mockInstructor }) {
	return (
		<div className="my-4">
			<Card title="Instructor" className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold">
							{mockInstructor.name.split(' ').map(n => n[0]).join('')}
						</div>
						<div className="flex-1">
							<h4 className="font-semibold text-slate-900 mb-1">{mockInstructor.name}</h4>
							<p className="text-sm text-slate-600 mb-2">{mockInstructor.specialization}</p>
							<div className="text-xs text-slate-500">
								{mockInstructor.yearsOfExperience} years experience
							</div>
						</div>
					</div>

					<Divider className="my-3" />

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-slate-600">
							<Mail className="w-4 h-4" />
							<span>{mockInstructor.email}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-slate-600">
							<Phone className="w-4 h-4" />
							<span>{mockInstructor.phone}</span>
						</div>
					</div>

					<div className="pt-2">
						<div className="text-xs font-medium text-slate-700 mb-2">Certifications:</div>
						<div className="flex flex-wrap gap-1">
							{mockInstructor.certifications.map((cert, index) => (
								<Tag key={index} size="small" color="blue">{cert}</Tag>
							))}
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}