import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Mail, Phone } from 'lucide-react';

export default function InstructorCard({ instructor }) {
    const { t } = useTranslation();

    const instructorData = instructor ? {
        name: instructor.fullname || instructor.name || "Unknown Instructor",
        role: t('trainee.instructorInfo.role', 'Instructor'),
        email: instructor.email || instructor.contactEmail || "email@example.com",
        phone: instructor.phoneNumber || instructor.phone || "N/A",
        avatar: instructor.avatarUrl || instructor.avatar || null,
        bio: t('trainee.myClassDetail.bio', 'Certified crane operator with 15+ years of experience in industrial training and safety compliance.'),
        certifications: [
            t('trainee.myClassDetail.certifications.lssctc', 'LSSCTC Certified'),
            t('trainee.myClassDetail.certifications.osha', 'OSHA 30-Hour'),
            t('trainee.myClassDetail.certifications.rigging', 'Advanced Rigging Specialist')
        ],
    } : {
        name: "TBD",
        role: t('trainee.instructorInfo.role', 'Instructor'),
        email: "contact@lssctc.com",
        avatar: null,
        bio: t('trainee.instructorInfo.noInstructor', 'Instructor information not available.'),
        certifications: [],
        phone: ""
    };

    const initials = instructorData.name.split(' ').filter(Boolean).slice(0, 2).map(n => n[0]).join('').toUpperCase();

    return (
        <div className="backdrop-blur-xl bg-neutral-900/60 text-white border border-white/20 shadow-xl sticky top-24 rounded-lg overflow-hidden">
            <div className="h-2 bg-yellow-400" />

            <div className="p-8">
                <h3 className="text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3">
                    <div className="w-1 h-6 bg-yellow-400" />
                    {t('trainee.myClassDetail.yourInstructor', 'Your Instructor')}
                </h3>

                <div className="mb-6">
                    <div className="w-32 h-32 mx-auto mb-4 border-4 border-yellow-400 overflow-hidden bg-white/10 flex items-center justify-center rounded-none shadow-sm">
                        {instructorData.avatar ? (
                            <img
                                src={instructorData.avatar}
                                alt={instructorData.name}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-4xl font-bold text-yellow-500">{initials}</span>
                        )}
                    </div>
                    <div className="text-center">
                        <h4 className="text-2xl font-black uppercase mb-1">{instructorData.name}</h4>
                        <p className="text-sm font-semibold text-neutral-300 uppercase tracking-wider">{instructorData.role}</p>
                    </div>
                </div>

                <div className="space-y-4 mb-6 pb-6 border-b border-white/10">
                    <p className="text-sm text-neutral-200 leading-relaxed font-normal">{instructorData.bio}</p>
                </div>

                <div className="space-y-3 mb-6">
                    {instructorData.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                            <span className="text-sm text-neutral-200 font-normal">{cert}</span>
                        </div>
                    ))}
                </div>

                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-sm">
                        <Mail className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-neutral-100 break-all font-normal">{instructorData.email}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10 rounded-sm">
                        <Phone className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm text-neutral-100 font-normal">{instructorData.phone}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
