import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactTyped } from 'react-typed';
import CraneEmbed from './CraneEmbed';

export default function HomeBanner() {
  const { t } = useTranslation();
  const phrases = [
    t('home.banner.phrases.craneSimulation'),
    t('home.banner.phrases.safetyTraining'),
    t('home.banner.phrases.operationalExcellence'),
    t('home.banner.phrases.realTimeAssessment'),
    t('home.banner.phrases.certifiedProgress')
  ];
  const prefersReducedMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className="relative overflow-hidden bg-blue-200 text-slate-900">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[32rem] h-[32rem] -translate-y-1/2 rounded-full bg-blue-50 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_60%)]" />
      </div>

      <div className="relative max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10 pt-14 pb-12 md:pt-20 md:pb-18 lg:pt-24 lg:pb-20">
        <div className="grid gap-12 md:gap-16 lg:grid-cols-2 items-start lg:items-center">
          {/* Left copy */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-2xl font-bold tracking-tight text-blue-700">LSSCTC</span>
              <span className="text-[10px] font-semibold uppercase bg-blue-50 px-2 py-1 rounded border border-blue-100 tracking-wide text-blue-600">{t('home.banner.platform')}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
              {t('home.banner.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400">{t('home.banner.titleHighlight')}</span><br className="hidden md:block" /> {t('home.banner.titleEnd')}
            </h1>
            <p className="mt-6 text-lg max-w-xl text-slate-600">{t('home.banner.description')}</p>
            <div className="my-6 text-base font-medium">
              <span className="text-blue-700 font-semibold">{t('home.banner.focusNow')}&nbsp;</span>
              <span className="inline-flex items-center relative">
                {prefersReducedMotion ? (
                  <span className="tabular-nums font-semibold">{phrases[0]}</span>
                ) : (
                  <>
                    <ReactTyped
                      strings={phrases}
                      typeSpeed={70}
                      backSpeed={40}
                      backDelay={1400}
                      loop
                      className="tabular-nums font-semibold text-blue-600"
                    />
                    <span className="ml-0.5 w-px h-6 bg-blue-500 animate-pulse" aria-hidden />
                  </>
                )}
              </span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/register" className="h-12 inline-flex items-center justify-center px-6 rounded-md bg-blue-600 text-white font-semibold shadow-sm hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-white">{t('home.banner.getStarted')}</a>
              <a href="#courses" className="h-12 inline-flex items-center justify-center px-6 rounded-md border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-white">{t('home.banner.exploreCourses')}</a>
              <a href="#simulator" className="h-12 inline-flex items-center justify-center px-6 rounded-md border border-blue-300 bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:ring-offset-white">{t('home.banner.liveSimulator')}</a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-6 text-xs text-slate-600">
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />{t('home.banner.features.realTimeScoring')}</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-amber-500" />{t('home.banner.features.safetyRubric')}</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500" />{t('home.banner.features.scenarioEngine')}</div>
              <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-fuchsia-500" />{t('home.banner.features.roleAnalytics')}</div>
            </div>
          </div>
          {/* Right visual (now visible on all breakpoints, stacks under text on small) */}
          <div className="relative lg:col-span-1">
            <div className="absolute -inset-6 bg-gradient-to-tr from-blue-200/40 via-blue-100/30 to-transparent rounded-3xl blur-2xl" aria-hidden />
            <div className="relative rounded-3xl border border-slate-200 bg-white/40 shadow-xl p-5 md:p-6 flex flex-col w-full max-w-xl xl:max-w-2xl mx-auto overflow-hidden">
              <CraneEmbed />
              <div className="mt-5 text-[11px] md:text-[12px] text-slate-600 px-1 leading-relaxed">
                <p className="font-semibold text-slate-900 mb-1 tracking-wide">{t('home.banner.craneModel.title')}</p>
                <p className="text-slate-600">{t('home.banner.craneModel.description')}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between">
                <span className="uppercase tracking-wider">{t('home.banner.craneModel.prototype')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
