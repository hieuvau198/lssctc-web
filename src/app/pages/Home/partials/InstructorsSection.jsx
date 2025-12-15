import React from 'react';
import { useTranslation } from 'react-i18next';
import { Users, ArrowRight } from 'lucide-react';

export default function InstructorsSection() {
  const { t } = useTranslation();
  const people = [
    { id: 'i1', name: 'Alex Tran', role: t('home.instructors.roles.leadInstructor'), initials: 'AT', color: 'from-cyan-500 to-blue-600' },
    { id: 'i2', name: 'Maria Lopez', role: t('home.instructors.roles.safetySpecialist'), initials: 'ML', color: 'from-emerald-500 to-teal-600' },
    { id: 'i3', name: 'Kenji Sato', role: t('home.instructors.roles.simulationDesigner'), initials: 'KS', color: 'from-violet-500 to-purple-600' },
    { id: 'i4', name: 'Linh Pham', role: t('home.instructors.roles.operationsCoach'), initials: 'LP', color: 'from-amber-500 to-orange-600' }
  ];

  return (
    <section id="instructors" className="py-12 md:py-16 bg-white">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200/50">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{t('home.instructors.title')}</h2>
              <p className="text-sm text-slate-500">{t('home.instructors.subtitle', 'Đội ngũ giảng viên chuyên nghiệp')}</p>
            </div>
          </div>
          <a href="#" className="text-cyan-600 text-sm hover:text-cyan-700 font-medium flex items-center gap-1 group">
            {t('home.instructors.meetTeam')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {people.map((p) => (
            <div
              key={p.id}
              className="group flex flex-col items-center rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl hover:shadow-cyan-100/50 hover:border-cyan-200 transition-all duration-300 text-center"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${p.color} text-white font-bold flex items-center justify-center text-lg shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {p.initials}
              </div>
              <p className="font-semibold text-base text-slate-900 mb-1">{p.name}</p>
              <p className="text-sm text-slate-500 mb-4">{p.role}</p>
              <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-1 group/btn">
                {t('home.instructors.profile')}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
