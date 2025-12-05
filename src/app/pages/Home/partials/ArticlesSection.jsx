import React from 'react';
import { useTranslation } from 'react-i18next';

// Articles / blog previews (static)
export default function ArticlesSection() {
  const { t } = useTranslation();
  const articles = [
    { id: 'a1', title: 'Reducing Swing: Best Practices in Container Crane Ops', date: '2025-07-12' },
    { id: 'a2', title: 'Designing Simulation Scenarios for Real Risk Factors', date: '2025-06-28' },
    { id: 'a3', title: 'Metrics That Matter: Performance vs. Safety Balance', date: '2025-05-30' }
  ];
  return (
    <section id="articles" className="py-14 md:py-18 bg-slate-50">
  <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-8">
          <h2 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight">{t('home.articles.title')}</h2>
          <a href="#" className="text-blue-600 text-sm hover:text-blue-700 font-medium">{t('home.articles.morePosts')}</a>
        </div>
        <div className="grid md:grid-cols-3 gap-7">
          {articles.map(a => (
            <article key={a.id} className="group flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-blue-500 hover:shadow-md transition-colors">
              <time className="text-[10px] uppercase tracking-wider text-slate-500">{formatDate(a.date)}</time>
              <h3 className="mt-2 font-medium text-sm md:text-base text-slate-900 leading-snug group-hover:text-blue-700">{a.title}</h3>
              <p className="mt-3 text-[11px] text-slate-600 line-clamp-3">{t('home.articles.teaser')}</p>
              <button className="mt-4 text-[11px] font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1">{t('home.articles.read')} <span aria-hidden>→</span></button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(str) {
  try { return new Date(str).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }); } catch { return str; }
}
