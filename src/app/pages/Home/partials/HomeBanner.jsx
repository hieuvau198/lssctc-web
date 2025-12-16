import React from 'react';
import { useTranslation } from 'react-i18next';
import { ReactTyped } from 'react-typed';
import CraneEmbed from './CraneEmbed';
import { ArrowRight, Play, CheckCircle, Users, Clock, Award, Target } from 'lucide-react';

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
    <section className="relative bg-black text-white py-20 md:py-28 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://i.ibb.co/fGDt4tzT/hinh-anh-xe-cau-3-1024x683.jpg"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/images/industrial-crane-construction-site.jpg";
          }}
          alt=""
          className="w-full h-full object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Provider badge */}
        <div className="mb-6 flex items-center gap-4 flex-wrap">
          <span
            className="text-sm tracking-widest text-white uppercase font-bold drop-shadow-lg"
            style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
          >
            LSSCTC ACADEMY
          </span>
          <span className="h-1 w-1 rounded-full bg-yellow-400" />
          <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
            {t('home.banner.platform')}
          </span>
        </div>

        {/* Main Heading */}
        <h1
          className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight uppercase mb-6 leading-none text-white drop-shadow-xl"
          style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}
        >
          {t('home.banner.title')}{' '}
          <span className="text-yellow-400">{t('home.banner.titleHighlight')}</span>
          <br className="hidden md:block" />
          {t('home.banner.titleEnd')}
        </h1>

        {/* Description */}
        <p
          className="text-xl text-white max-w-3xl mb-8 leading-relaxed font-medium drop-shadow-lg"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}
        >
          {t('home.banner.description')}
        </p>

        {/* Typed text */}
        <div className="mb-10 text-lg font-medium">
          <span className="text-yellow-400 font-bold uppercase tracking-wider">{t('home.banner.focusNow')}&nbsp;</span>
          <span className="inline-flex items-center">
            {prefersReducedMotion ? (
              <span className="font-bold text-white">{phrases[0]}</span>
            ) : (
              <>
                <ReactTyped
                  strings={phrases}
                  typeSpeed={70}
                  backSpeed={40}
                  backDelay={1400}
                  loop
                  className="font-bold text-yellow-400"
                />
                <span className="ml-1 w-0.5 h-6 bg-yellow-400 animate-pulse" aria-hidden />
              </>
            )}
          </span>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap gap-4 mb-12">
          <a
            href="/program"
            className="h-14 inline-flex items-center justify-center px-8 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-white transition-colors gap-2 group"
          >
            {t('home.banner.getStarted')}
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="/simulator"
            className="h-14 inline-flex items-center justify-center px-8 border-2 border-yellow-400 text-yellow-400 font-bold uppercase tracking-wider hover:bg-yellow-400 hover:text-black transition-all gap-2 group"
          >
            <Play className="w-5 h-5" />
            {t('home.banner.liveSimulator')}
          </a>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3">
            <div className="w-12 h-12 bg-yellow-400 flex items-center justify-center">
              <Users className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white drop-shadow-md">500+</div>
              <div className="text-sm text-yellow-400 uppercase tracking-wider font-semibold">Học viên</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3">
            <div className="w-12 h-12 bg-white flex items-center justify-center">
              <Clock className="w-6 h-6 text-black" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white drop-shadow-md">50+</div>
              <div className="text-sm text-yellow-400 uppercase tracking-wider font-semibold">Khóa học</div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-black/50 backdrop-blur-sm px-4 py-3">
            <div className="w-12 h-12 border-2 border-yellow-400 bg-black/50 flex items-center justify-center">
              <Award className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-white drop-shadow-md">98%</div>
              <div className="text-sm text-yellow-400 uppercase tracking-wider font-semibold">Đạt chứng chỉ</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
