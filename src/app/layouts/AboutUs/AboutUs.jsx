import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Award,
  ShieldCheck,
  ClipboardList,
  Users,
  CheckCircle2,
  GraduationCap,
  Target,
  Sparkles,
} from 'lucide-react';

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-gradient-to-br from-cyan-200/40 to-blue-200/40 blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[32rem] h-[32rem] -translate-y-1/2 rounded-full bg-gradient-to-bl from-cyan-100/50 to-blue-100/50 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.05),transparent_60%)]" />
        </div>

        <div className="relative max-w-[1380px] mx-auto px-4 py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              {t('about.badge', 'Đào tạo chuyên nghiệp')}
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
              {t('about.heroTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-500">LSSCTC</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-slate-600">
              {t('about.heroDescription')}
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-lg text-sm font-medium mb-4">
                <Target className="w-4 h-4" />
                {t('about.ourMission', 'Sứ mệnh của chúng tôi')}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('about.missionTitle')}</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {t('about.missionDescription')}
              </p>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-r-xl">
                <h3 className="text-xl font-semibold text-cyan-900 mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-600" />
                  {t('about.visionTitle')}
                </h3>
                <p className="text-cyan-800">
                  {t('about.visionDescription')}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-2xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop"
                alt="Crane training facility"
                className="relative w-full h-96 object-cover rounded-2xl shadow-2xl shadow-slate-300/50"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 bg-gradient-to-r from-cyan-600 via-blue-600 to-cyan-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
        </div>

        <div className="relative max-w-[1380px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('about.storyTitle')}</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              {t('about.storySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { value: '20+', title: t('about.yearsExperience'), desc: t('about.yearsExperienceDesc') },
              { value: '5K+', title: t('about.trainedOperators'), desc: t('about.trainedOperatorsDesc') },
              { value: '98%', title: t('about.successRate'), desc: t('about.successRateDesc') },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="bg-white text-cyan-600 w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4 shadow-lg">
                  {stat.value}
                </div>
                <h3 className="text-xl font-semibold mb-2">{stat.title}</h3>
                <p className="text-white/70">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Facilities */}
      <section className="py-16">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="absolute -inset-4 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-2xl blur-2xl" />
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1470&auto=format&fit=crop"
                alt="Modern training facility"
                className="relative w-full h-96 object-cover rounded-2xl shadow-2xl shadow-slate-300/50"
                loading="lazy"
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-lg text-sm font-medium mb-4">
                <GraduationCap className="w-4 h-4" />
                {t('about.facilities', 'Cơ sở vật chất')}
              </div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('about.facilitiesTitle')}</h2>
              <div className="space-y-4">
                {[
                  { title: t('about.modernCraneFleet'), desc: t('about.modernCraneFleetDesc') },
                  { title: t('about.advancedSimulators'), desc: t('about.advancedSimulatorsDesc') },
                  { title: t('about.dedicatedTrainingYards'), desc: t('about.dedicatedTrainingYardsDesc') },
                  { title: t('about.classroomTechnology'), desc: t('about.classroomTechnologyDesc') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-cyan-200 hover:shadow-lg hover:shadow-cyan-100/50 transition-all duration-300">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="text-slate-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Certifications */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-lg text-sm font-medium mb-4">
              <ShieldCheck className="w-4 h-4" />
              {t('about.certifications', 'Chứng nhận')}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('about.safetyTitle')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('about.safetySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Award, title: t('about.ncccoCertified'), desc: t('about.ncccoCertifiedDesc') },
              { icon: ShieldCheck, title: t('about.oshaCompliant'), desc: t('about.oshaCompliantDesc') },
              { icon: ClipboardList, title: t('about.isoCertified'), desc: t('about.isoCertifiedDesc') },
              { icon: Users, title: t('about.industryPartnerships'), desc: t('about.industryPartnershipsDesc') },
            ].map((item, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 text-center hover:shadow-xl hover:shadow-cyan-100/50 hover:border-cyan-200 transition-all duration-300 group">
                <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-200/50 group-hover:scale-110 transition-transform duration-300">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">{item.title}</h4>
                <p className="text-sm text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cyan-50 text-cyan-600 rounded-lg text-sm font-medium mb-4">
              <Users className="w-4 h-4" />
              {t('about.team', 'Đội ngũ')}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('about.leadershipTitle')}</h2>
            <p className="text-lg text-slate-600">
              {t('about.leadershipSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop', name: 'John Anderson', role: t('about.trainingDirector'), desc: t('about.trainingDirectorDesc') },
              { img: 'https://images.unsplash.com/photo-1494790108755-2616c6c906cd?q=80&w=1470&auto=format&fit=crop', name: 'Sarah Chen', role: t('about.safetyManager'), desc: t('about.safetyManagerDesc') },
              { img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop', name: 'Michael Rodriguez', role: t('about.operationsManager'), desc: t('about.operationsManagerDesc') },
            ].map((person, i) => (
              <div key={i} className="text-center group">
                <div className="relative inline-block mb-4">
                  <div className="absolute -inset-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 blur-lg transition-opacity duration-300" />
                  <img
                    src={person.img}
                    alt={person.name}
                    className="relative w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-white shadow-xl"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-xl font-semibold text-slate-900">{person.name}</h4>
                <p className="text-cyan-600 font-medium mb-2">{person.role}</p>
                <p className="text-sm text-slate-600">{person.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}