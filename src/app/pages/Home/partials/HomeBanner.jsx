import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactTyped } from 'react-typed';
import CraneEmbed from './CraneEmbed';
import { Sparkles, ArrowRight, Play } from 'lucide-react';

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
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-cyan-50/30 to-blue-50">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-200/50 to-blue-200/50 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[32rem] h-[32rem] -translate-y-1/2 rounded-full bg-gradient-to-bl from-cyan-100/40 to-blue-100/40 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.06),transparent_60%)]" />
      </div>

      <div className="relative max-w-[1380px] mx-auto px-5 sm:px-6 md:px-10 pt-10 pb-12 md:pt-20 md:pb-18 lg:pt-14 lg:pb-20">
        <div className="grid gap-12 md:gap-16 lg:grid-cols-2 items-start lg:items-center">
          {/* Left copy */}
          <div>
            <div className="flex items-center gap-3 ">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">LSSCTC</span>
                <span className="text-[10px] font-semibold uppercase bg-gradient-to-r from-cyan-100 to-blue-100 px-2 py-1 rounded-full border border-cyan-200 tracking-wide text-cyan-700">{t('home.banner.platform')}</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900">
              {t('home.banner.title')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500">{t('home.banner.titleHighlight')}</span><br className="hidden md:block" /> {t('home.banner.titleEnd')}
            </h1>
            <p className="mt-6 text-lg max-w-xl text-slate-600">{t('home.banner.description')}</p>
            <div className="my-6 text-base font-medium">
              <span className="text-cyan-700 font-semibold">{t('home.banner.focusNow')}&nbsp;</span>
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
                      className="tabular-nums font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600"
                    />
                    <span className="ml-0.5 w-px h-6 bg-cyan-500 animate-pulse" aria-hidden />
                  </>
                )}
              </span>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="/program" className="h-12 inline-flex items-center justify-center px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold shadow-lg shadow-cyan-200/50 hover:shadow-cyan-300/60 hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 gap-2">
                {t('home.banner.getStarted')}
                <ArrowRight className="w-4 h-4" />
              </a>
              {/* <a href="/courses" className="h-12 inline-flex items-center justify-center px-6 rounded-xl border border-slate-300 bg-white text-slate-700 font-medium hover:bg-slate-50 hover:border-cyan-300 transition-all duration-200">
                {t('home.banner.exploreCourses')}
              </a> */}
              <a href="/simulator" className="h-12 inline-flex items-center justify-center px-6 rounded-xl border border-cyan-300 bg-cyan-50 text-cyan-700 font-medium hover:bg-cyan-100 transition-all duration-200 gap-2">
                <Play className="w-4 h-4" />
                {t('home.banner.liveSimulator')}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-4 text-xs">
              {[
                { color: 'bg-emerald-500', text: t('home.banner.features.realTimeScoring'), pulse: true },
                { color: 'bg-amber-500', text: t('home.banner.features.safetyRubric') },
                { color: 'bg-cyan-500', text: t('home.banner.features.scenarioEngine') },
                { color: 'bg-violet-500', text: t('home.banner.features.roleAnalytics') },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm border border-slate-200">
                  <span className={`h-2 w-2 rounded-full ${item.color} ${item.pulse ? 'animate-pulse' : ''}`} />
                  <span className="text-slate-600">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Right visual */}
          <div className="relative lg:col-span-1">
            <div className="absolute -inset-6 bg-gradient-to-tr from-cyan-200/40 via-blue-100/30 to-transparent rounded-3xl blur-2xl" aria-hidden />
            <div className="relative rounded-2xl border border-slate-200/60 bg-white/80 backdrop-blur-sm shadow-2xl shadow-slate-200/50 p-5 md:p-6 flex flex-col w-full max-w-xl xl:max-w-2xl mx-auto overflow-hidden">
              {/* <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full mb-4" /> */}
              <CraneEmbed />
              <div className="mt-5 text-[11px] md:text-[12px] text-slate-600 px-1 leading-relaxed">
                <p className="font-semibold text-slate-900 mb-1 tracking-wide">{t('home.banner.craneModel.title')}</p>
                <p className="text-slate-600">{t('home.banner.craneModel.description')}</p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-200 text-[10px] text-slate-500 flex justify-between items-center">
                <span className="uppercase tracking-wider">{t('home.banner.craneModel.prototype')}</span>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-emerald-600 font-medium">Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
