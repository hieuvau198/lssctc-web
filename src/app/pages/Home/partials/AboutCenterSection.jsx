import React from 'react';
import { useTranslation } from 'react-i18next';

// About training center / platform description section
export default function AboutCenterSection() {
  const { t } = useTranslation();
  const points = [
    t('home.aboutCenter.points.scenario'),
    t('home.aboutCenter.points.analytics'),
    t('home.aboutCenter.points.modular'),
    t('home.aboutCenter.points.dashboard'),
    t('home.aboutCenter.points.api')
  ];
  return (
    <section id="about" className="py-16 md:py-20 relative overflow-hidden bg-gradient-to-tl from-blue-100 via-blue-50/50 to-sky-100">
      {/* subtle decorative shapes for separation */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -top-20 right-[-4rem] w-[28rem] h-[28rem] rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute bottom-[-6rem] left-[-6rem] w-[22rem] h-[22rem] rounded-full bg-amber-100/30 blur-3xl" />
      </div>
  <div className="max-w-[1160px] md:max-w-[1320px] mx-auto px-5 sm:px-6 md:px-10">
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight mb-6">{t('home.aboutCenter.title')}</h2>
        <p className="text-sm md:text-base text-slate-700 leading-relaxed max-w-3xl">{t('home.aboutCenter.description')}</p>
        <ul className="mt-8 space-y-3">
          {points.map(pt => (
            <li key={pt} className="flex items-start gap-3 text-sm text-slate-700"><span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" /> <span>{pt}</span></li>
          ))}
        </ul>
        <div className="mt-8 flex flex-wrap gap-4 text-[11px] text-slate-600">
          <span className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">{t('home.aboutCenter.tags.version')}</span>
          <span className="px-3 py-1 rounded-full bg-green-50 border border-green-200 text-green-700">{t('home.aboutCenter.tags.apiReady')}</span>
          <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700">{t('home.aboutCenter.tags.swrHooks')}</span>
        </div>
      </div>
    </section>
  );
}
