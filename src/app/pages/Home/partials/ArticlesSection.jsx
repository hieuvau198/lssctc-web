import React from 'react';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight, FileText } from 'lucide-react';

export default function ArticlesSection() {
  const { t } = useTranslation();
  const articles = [
    { id: 'a1', title: 'Reducing Swing: Best Practices in Container Crane Ops', date: '2025-07-12' },
    { id: 'a2', title: 'Designing Simulation Scenarios for Real Risk Factors', date: '2025-06-28' },
    { id: 'a3', title: 'Metrics That Matter: Performance vs. Safety Balance', date: '2025-05-30' }
  ];

  return (
    <section id="articles" className="py-14 md:py-18 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10">
        <div className="flex items-baseline justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-200/50">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">{t('home.articles.title')}</h2>
              <p className="text-sm text-slate-500">{t('home.articles.subtitle', 'Tin tức và bài viết mới nhất')}</p>
            </div>
          </div>
          <a href="#" className="text-cyan-600 text-sm hover:text-cyan-700 font-medium flex items-center gap-1 group">
            {t('home.articles.morePosts')}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {articles.map((a, i) => (
            <article
              key={a.id}
              className="group flex flex-col rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm p-6 shadow-sm hover:shadow-xl hover:shadow-cyan-100/50 hover:border-cyan-200 transition-all duration-300"
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-cyan-500" />
                <time className="text-xs font-medium text-cyan-600">{formatDate(a.date)}</time>
              </div>
              <h3 className="font-semibold text-base text-slate-900 leading-snug group-hover:text-cyan-700 transition-colors mb-3">
                {a.title}
              </h3>
              <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-1">
                {t('home.articles.teaser')}
              </p>
              <button className="text-sm font-semibold text-cyan-600 hover:text-cyan-700 inline-flex items-center gap-2 group/btn">
                {t('home.articles.read')}
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatDate(str) {
  try {
    return new Date(str).toLocaleDateString('vi-VN', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return str;
  }
}
