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
  ChevronRight,
} from 'lucide-react';

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Industrial Style */}
      <section className="relative bg-black text-white py-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="mb-6 flex items-center justify-center gap-4">
            <span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              LSSCTC ACADEMY
            </span>
            <span className="h-1 w-1 rounded-full bg-yellow-400" />
            <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
              {t('about.badge', 'Đào tạo chuyên nghiệp')}
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight mb-6 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
            {t('about.heroTitle')} <span className="text-yellow-400">LSSCTC</span>
          </h1>

          <p className="text-xl md:text-2xl max-w-3xl mx-auto leading-relaxed text-white font-medium drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {t('about.heroDescription')}
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
                {t('about.ourMission', 'Sứ mệnh của chúng tôi')}
              </span>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
                {t('about.missionTitle')}
              </h2>
              <div className="h-1 w-24 bg-yellow-400 mb-6" />

              <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                {t('about.missionDescription')}
              </p>

              {/* Vision Card */}
              <div className="bg-black text-white p-6">
                <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
                <h3 className="text-xl font-black uppercase tracking-wider mb-3 flex items-center gap-2">
                  <div className="w-1 h-6 bg-yellow-400" />
                  {t('about.visionTitle')}
                </h3>
                <p className="text-neutral-300">
                  {t('about.visionDescription')}
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="border-4 border-yellow-400 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop"
                  alt="Crane training facility"
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company History / Stats */}
      <section className="py-16 bg-black text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{t('about.storyTitle')}</h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto mb-4" />
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              {t('about.storySubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { value: '20+', title: t('about.yearsExperience'), desc: t('about.yearsExperienceDesc') },
              { value: '5K+', title: t('about.trainedOperators'), desc: t('about.trainedOperatorsDesc') },
              { value: '98%', title: t('about.successRate'), desc: t('about.successRateDesc') },
            ].map((stat, i) => (
              <div key={i} className="border-2 border-neutral-700 p-8 text-center hover:border-yellow-400 transition-all group">
                <div className="h-2 bg-neutral-800 group-hover:bg-yellow-400 transition-colors -mx-8 -mt-8 mb-6" />
                <div className="w-20 h-20 bg-yellow-400 flex items-center justify-center text-3xl font-black text-black mx-auto mb-4">
                  {stat.value}
                </div>
                <h3 className="text-xl font-black uppercase tracking-wider mb-2">{stat.title}</h3>
                <p className="text-neutral-400">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Training Facilities */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative order-2 lg:order-1">
              <div className="border-4 border-neutral-900 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1470&auto=format&fit=crop"
                  alt="Modern training facility"
                  className="w-full h-96 object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
                {t('about.facilities', 'Cơ sở vật chất')}
              </span>
              <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
                {t('about.facilitiesTitle')}
              </h2>
              <div className="h-1 w-24 bg-yellow-400 mb-8" />

              <div className="space-y-4">
                {[
                  { title: t('about.modernCraneFleet'), desc: t('about.modernCraneFleetDesc') },
                  { title: t('about.advancedSimulators'), desc: t('about.advancedSimulatorsDesc') },
                  { title: t('about.dedicatedTrainingYards'), desc: t('about.dedicatedTrainingYardsDesc') },
                  { title: t('about.classroomTechnology'), desc: t('about.classroomTechnologyDesc') },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 bg-neutral-50 border-2 border-neutral-900 hover:border-yellow-400 transition-all group">
                    <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <h4 className="font-black uppercase text-neutral-900 group-hover:text-yellow-600 transition-colors">{item.title}</h4>
                      <p className="text-neutral-600 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Certifications */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              {t('about.certifications', 'Chứng nhận')}
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{t('about.safetyTitle')}</h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto mb-4" />
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
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
              <div key={i} className="bg-white border-2 border-neutral-900 text-center hover:border-yellow-400 transition-all group">
                <div className="h-2 bg-neutral-100 group-hover:bg-yellow-400 transition-colors" />
                <div className="p-6">
                  <div className="mb-4 inline-flex items-center justify-center w-14 h-14 bg-yellow-400 group-hover:scale-110 transition-transform duration-300">
                    <item.icon className="w-7 h-7 text-black" />
                  </div>
                  <h4 className="font-black uppercase text-neutral-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-neutral-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              {t('about.team', 'Đội ngũ')}
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">{t('about.leadershipTitle')}</h2>
            <div className="h-1 w-24 bg-yellow-400 mx-auto mb-4" />
            <p className="text-lg text-neutral-600">
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
                  <div className="w-32 h-32 border-4 border-yellow-400 overflow-hidden mx-auto">
                    <img
                      src={person.img}
                      alt={person.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
                <h4 className="text-xl font-black uppercase text-neutral-900">{person.name}</h4>
                <p className="text-yellow-600 font-bold uppercase tracking-wider text-sm mb-2">{person.role}</p>
                <p className="text-sm text-neutral-600">{person.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-black text-white py-16 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-black uppercase mb-4">Bắt đầu hành trình của bạn</h2>
          <p className="text-neutral-400 mb-8 max-w-2xl mx-auto">
            Tham gia cùng hàng ngàn học viên đã thành công với chứng chỉ vận hành cần cẩu chuyên nghiệp
          </p>
          <a
            href="/program"
            className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-white transition-colors group"
          >
            Khám phá chương trình
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </section>
    </div>
  );
}