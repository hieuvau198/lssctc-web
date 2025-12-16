import React from 'react';
import { useTranslation } from 'react-i18next';
import { Shield, Settings, Monitor, Wrench, Ship, BarChart3, ChevronRight } from 'lucide-react';

export default function CategoriesSection() {
  const { t } = useTranslation();

  const categories = [
    { key: 'safety', label: t('home.categories.safety.label'), desc: t('home.categories.safety.desc'), icon: Shield },
    { key: 'ops', label: t('home.categories.ops.label'), desc: t('home.categories.ops.desc'), icon: Settings },
    { key: 'sim', label: t('home.categories.sim.label'), desc: t('home.categories.sim.desc'), icon: Monitor },
    { key: 'maintenance', label: t('home.categories.maintenance.label'), desc: t('home.categories.maintenance.desc'), icon: Wrench },
    { key: 'logistics', label: t('home.categories.logistics.label'), desc: t('home.categories.logistics.desc'), icon: Ship },
    { key: 'assessment', label: t('home.categories.assessment.label'), desc: t('home.categories.assessment.desc'), icon: BarChart3 }
  ];

  return (
    <section id="categories" className="bg-neutral-50 border-y border-neutral-200">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Section Header */}
        <div className="mb-10">
          <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
            {t('home.categories.subtitle', 'Khám phá các danh mục')}
          </span>
          <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
            {t('home.categories.title')}
          </h2>
          <div className="h-1 w-24 bg-yellow-400" />
        </div>

        {/* Category Cards Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {categories.map((c, index) => (
            <a
              key={c.key}
              href="/program"
              className="group bg-white border-2 border-neutral-900 hover:border-yellow-400 transition-all"
            >
              {/* Status indicator bar */}
              <div className="h-2 bg-neutral-100 group-hover:bg-yellow-400 transition-colors" />

              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Number Badge */}
                  <div className="flex-shrink-0 w-12 h-12 border-2 border-neutral-300 group-hover:bg-yellow-400 group-hover:border-yellow-400 flex items-center justify-center font-black text-xl transition-all">
                    <c.icon className="w-6 h-6 text-neutral-400 group-hover:text-black transition-colors" />
                  </div>

                  <div className="flex-1">
                    {/* Meta */}
                    <span className="text-xs font-bold tracking-widest text-neutral-500 uppercase block mb-2">
                      Module {index + 1}
                    </span>

                    {/* Label */}
                    <h3 className="text-lg font-black uppercase mb-2 group-hover:text-yellow-600 transition-colors">
                      {c.label}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-neutral-600 leading-relaxed line-clamp-2">
                      {c.desc}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0 w-10 h-10 border-2 border-neutral-900 group-hover:bg-yellow-400 group-hover:border-yellow-400 flex items-center justify-center transition-all group-hover:translate-x-1">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
