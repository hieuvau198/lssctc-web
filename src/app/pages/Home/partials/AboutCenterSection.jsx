import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Cpu, BarChart3, Layers, Code, ChevronRight, Award, Users, Clock } from 'lucide-react';

export default function AboutCenterSection() {
  const { t } = useTranslation();

  const features = [
    { icon: Layers, text: t('home.aboutCenter.points.scenario') },
    { icon: BarChart3, text: t('home.aboutCenter.points.analytics') },
    { icon: Cpu, text: t('home.aboutCenter.points.modular') },
    { icon: CheckCircle, text: t('home.aboutCenter.points.dashboard') },
    { icon: Code, text: t('home.aboutCenter.points.api') }
  ];

  const stats = [
    { icon: Award, value: '10+', label: 'Năm kinh nghiệm' },
    { icon: Users, value: '50+', label: 'Đối tác doanh nghiệp' },
    { icon: Clock, value: '99%', label: 'Uptime hệ thống' },
  ];

  return (
    <section id="about" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left content */}
          <div>
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Về chúng tôi
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              {t('home.aboutCenter.title')}
            </h2>
            <div className="h-1 w-24 bg-yellow-400 mb-8" />

            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
              {t('home.aboutCenter.description')}
            </p>

            {/* Feature list */}
            <ul className="space-y-4 mb-8">
              {features.map((item, i) => (
                <li key={i} className="flex items-start gap-4 group">
                  <div className="flex-shrink-0 w-10 h-10 border-2 border-neutral-900 group-hover:bg-yellow-400 group-hover:border-yellow-400 flex items-center justify-center transition-all">
                    <item.icon className="w-5 h-5 text-neutral-700" />
                  </div>
                  <span className="text-neutral-700 pt-2 leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>

            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              <span className="px-4 py-2 bg-yellow-400 text-black text-sm font-bold uppercase tracking-wider">
                {t('home.aboutCenter.tags.version')}
              </span>
              <span className="px-4 py-2 border-2 border-neutral-900 text-black text-sm font-bold uppercase tracking-wider">
                {t('home.aboutCenter.tags.apiReady')}
              </span>
              <span className="px-4 py-2 border-2 border-neutral-900 text-black text-sm font-bold uppercase tracking-wider">
                {t('home.aboutCenter.tags.swrHooks')}
              </span>
            </div>
          </div>

          {/* Right content - Stats cards */}
          <div className="space-y-6">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="bg-white border-2 border-neutral-900 hover:border-yellow-400 transition-all group"
              >
                <div className="h-2 bg-neutral-100 group-hover:bg-yellow-400 transition-colors" />
                <div className="p-6 flex items-center gap-6">
                  <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <stat.icon className="w-8 h-8 text-black" />
                  </div>
                  <div>
                    <p className="text-4xl font-black text-black">{stat.value}</p>
                    <p className="text-sm text-neutral-500 uppercase tracking-wider font-semibold">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* CTA Card */}
            <div className="bg-black text-white border-4 border-black">
              <div className="h-2 bg-yellow-400" />
              <div className="p-8">
                <h3 className="text-xl font-black uppercase tracking-wider mb-2 flex items-center gap-3">
                  <div className="w-1 h-6 bg-yellow-400" />
                  Bắt đầu hành trình
                </h3>
                <p className="text-neutral-400 text-sm mb-6">
                  Tham gia cùng hàng trăm học viên đã đạt chứng chỉ vận hành cẩu trục
                </p>
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-white transition-colors group"
                >
                  Đăng ký ngay
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
