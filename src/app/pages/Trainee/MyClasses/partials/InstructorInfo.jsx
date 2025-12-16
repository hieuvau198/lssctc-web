import React, { useEffect, useState } from 'react';
import { Skeleton, message } from 'antd';
import { Mail, Phone, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fetchClassInstructor } from '../../../../apis/ProgramManager/ClassesApi';

export default function InstructorInfo({ classId }) {
	const { t } = useTranslation();

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
					message.error(t('trainee.instructorInfo.loadFailed'));
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
			<div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
				<div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-500" />
				<div className="p-5">
					<Skeleton active avatar paragraph={{ rows: 2 }} />
				</div>
			</div>
		);
	}

	if (!remoteInstructor) {
		return (
			<div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
				<div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-500" />
				<div className="p-5">
					<h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
						<User className="w-5 h-5 text-indigo-500" />
						{t('trainee.instructorInfo.title')}
					</h3>
					<div className="text-center text-slate-400 py-4">
						{t('trainee.instructorInfo.noInstructor')}
					</div>
				</div>
			</div>
		);
	}

	const instr = remoteInstructor;
	const name = instr.fullname || instr.name || 'Unknown Instructor';
	const email = instr.email || instr.contactEmail || '';
	const phone = instr.phoneNumber || instr.phone || '';
	const avatarUrl = instr.avatarUrl || instr.avatar || null;

	const initials = name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();

	return (
		<div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-lg overflow-hidden shadow-lg shadow-slate-200/50">
			<div className="h-1 bg-gradient-to-r from-indigo-400 to-purple-500" />
			<div className="p-5">
				<h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
					<User className="w-5 h-5 text-indigo-500" />
					{t('trainee.instructorInfo.title')}
				</h3>

				<div className="flex items-center gap-4 mb-4">
					{avatarUrl ? (
						<div className="w-14 h-14 rounded-full bg-gradient-to-r from-indigo-400 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25">
							<img src={avatarUrl} alt={name} className="w-full h-full rounded-full object-cover bg-white" />
						</div>
					) : (
						<div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-500/25">
							{initials}
						</div>
					)}
					<div>
						<span className="font-bold text-slate-800 text-lg">{name}</span>
						<p className="text-sm text-slate-500">{t('trainee.instructorInfo.role')}</p>
					</div>
				</div>

				<div className="space-y-3 pt-4 border-t border-slate-100">
					<div className="flex items-center gap-3 text-sm">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100/80 flex items-center justify-center">
							<Mail className="w-4 h-4 text-indigo-500" />
						</div>
						<span className="text-slate-600">{email || '-'}</span>
					</div>
					<div className="flex items-center gap-3 text-sm">
						<div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100/80 flex items-center justify-center">
							<Phone className="w-4 h-4 text-purple-500" />
						</div>
						<span className="text-slate-600">{phone || '-'}</span>
					</div>
				</div>
			</div>
		</div>
	);
}
