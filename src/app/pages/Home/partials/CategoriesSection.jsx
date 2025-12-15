import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Settings, Monitor, Wrench, Ship, BarChart3, ArrowRight } from 'lucide-react';

export default function CategoriesSection() {
  const { t } = useTranslation();

  const categories = [
    { key: 'safety', label: t('home.categories.safety.label'), desc: t('home.categories.safety.desc'), icon: Shield, color: 'from-emerald-500 to-teal-600' },
    { key: 'ops', label: t('home.categories.ops.label'), desc: t('home.categories.ops.desc'), icon: Settings, color: 'from-cyan-500 to-blue-600' },
    { key: 'sim', label: t('home.categories.sim.label'), desc: t('home.categories.sim.desc'), icon: Monitor, color: 'from-violet-500 to-purple-600' },
    { key: 'maintenance', label: t('home.categories.maintenance.label'), desc: t('home.categories.maintenance.desc'), icon: Wrench, color: 'from-amber-500 to-orange-600' },
    { key: 'logistics', label: t('home.categories.logistics.label'), desc: t('home.categories.logistics.desc'), icon: Ship, color: 'from-blue-500 to-indigo-600' },
    { key: 'assessment', label: t('home.categories.assessment.label'), desc: t('home.categories.assessment.desc'), icon: BarChart3, color: 'from-rose-500 to-pink-600' }
  ];

  return (
    <section id="categories" className="py-14 md:py-18 bg-white">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{t('home.categories.title')}</h2>
            <p className="text-sm text-slate-500 mt-1">{t('home.categories.subtitle', 'Khám phá các danh mục đào tạo')}</p>
          </div>
          <a href="#" className="text-cyan-600 text-sm hover:text-cyan-700 font-medium flex items-center gap-1 group">
            {t('home.categories.viewAll')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {categories.map((c) => (
            <div
              key={c.key}
              className="group relative rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-5 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-cyan-200 transition-all duration-300 cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.color} flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <c.icon className="w-6 h-6 text-white" />
              </div>
              <p className="font-semibold text-sm text-slate-900 leading-tight mb-2">{c.label}</p>
              <p className="text-xs text-slate-500 line-clamp-2">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
