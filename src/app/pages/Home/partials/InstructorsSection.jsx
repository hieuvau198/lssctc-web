import React from 'react';
import { useTranslation } from 'react-i18next';

// Instructor highlights (static mock data)
export default function InstructorsSection() {
  const { t } = useTranslation();
  const people = [
    { id: 'i1', name: 'Alex Tran', role: t('home.instructors.roles.leadInstructor'), initials: 'AT' },
    { id: 'i2', name: 'Maria Lopez', role: t('home.instructors.roles.safetySpecialist'), initials: 'ML' },
    { id: 'i3', name: 'Kenji Sato', role: t('home.instructors.roles.simulationDesigner'), initials: 'KS' },
    { id: 'i4', name: 'Linh Pham', role: t('home.instructors.roles.operationsCoach'), initials: 'LP' }
  ];
  return (
    <section id="instructors" className="py-12 md:py-16 bg-white">
  <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">{t('home.instructors.title')}</h2>
          <a href="#" className="text-blue-600 text-sm hover:text-blue-700 font-medium">{t('home.instructors.meetTeam')}</a>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {people.map(p => (
            <div key={p.id} className="flex flex-col items-start rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-colors">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-300 text-blue-900 font-bold flex items-center justify-center text-sm shadow ring-2 ring-blue-100 mb-3">{p.initials}</div>
              <p className="font-medium text-sm text-slate-900 leading-tight">{p.name}</p>
              <p className="text-[11px] text-slate-600">{p.role}</p>
              <button className="mt-3 text-[11px] font-semibold text-blue-600 hover:text-blue-700">{t('home.instructors.profile')} →</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
