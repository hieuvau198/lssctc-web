import React, { useEffect, useState } from 'react';
import { Card, Divider, Tag, Skeleton, message } from 'antd';
import { Mail, Phone } from 'lucide-react';
import { fetchClassInstructor } from '../../../../apis/ProgramManager/ClassesApi';

export default function InstructorInfo({ classId }) {

	const [remoteInstructor, setRemoteInstructor] = useState(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		let mounted = true;
		async function load() {
			if (!classId) {
				setRemoteInstructor(null);
				return;
			}
			setLoading(true);
			try {
				const data = await fetchClassInstructor(classId);
				if (mounted) {
					setRemoteInstructor(data || null);
				}
			} catch (err) {
				console.error('fetchClassInstructor error', err);
				if (mounted) {
					message.error('Không tải được thông tin instructor');
					setRemoteInstructor(null);
				}
			} finally {
				if (mounted) setLoading(false);
			}
		}
		load();
		return () => { mounted = false; };
	}, [classId]);

	if (loading) {
		return (
			<div className="my-4">
				<Card title="Instructor" className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
					<Skeleton active avatar paragraph={{ rows: 3 }} />
				</Card>
			</div>
		);
	}

	if (!remoteInstructor) {
		return (
			<div className="my-4">
				<Card title="Instructor" className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
					<div className="text-center text-slate-500 py-4">
						Không có thông tin instructor
					</div>
				</Card>
			</div>
		);
	}

	const instr = remoteInstructor;
	const name = instr.fullname || instr.name || 'Unknown Instructor';
	const email = instr.email || instr.contactEmail || '';
	const phone = instr.phoneNumber || instr.phone || '';
	const avatarUrl = instr.avatarUrl || instr.avatar || null;
	const code = instr.instructorCode || instr.code || null;
	const hireDate = instr.hireDate ? new Date(instr.hireDate) : null;

	const initials = name.split(' ').filter(Boolean).slice(0,2).map(n => n[0]).join('').toUpperCase();

	return (
		<div className="my-4">
			<Card title="Instructor" className="rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
				<div className="space-y-4">
					<div className="flex items-start gap-3">
						{avatarUrl ? (
							<img src={avatarUrl} alt={name} className="w-12 h-12 rounded-full object-cover" />
						) : (
							<div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center font-semibold">
								{initials}
							</div>
						)}

						<div className="flex-1">
							<h4 className="font-semibold text-slate-900 mb-1">{name}</h4>
							{code && <div className="text-sm text-slate-600 mb-1">Code: <span className="font-medium">{code}</span></div>}
							{/* {hireDate && <div className="text-xs text-slate-500">Hired: {hireDate.toLocaleDateString()}</div>} */}
						</div>
					</div>

					<Divider className="my-2" />

					<div className="space-y-2">
						<div className="flex items-center gap-2 text-sm text-slate-600">
							<Mail className="w-4 h-4" />
							<span>{email}</span>
						</div>
						<div className="flex items-center gap-2 text-sm text-slate-600">
							<Phone className="w-4 h-4" />
							<span>{phone}</span>
						</div>
					</div>
				</div>
			</Card>
		</div>
	);
}