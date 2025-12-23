import React, { useCallback, useEffect, useState } from 'react';
import { Button, Skeleton, Alert, Tabs } from 'antd';
import { Download, Info, Laptop2, Settings, PlayCircle, ExternalLink, Monitor, Cpu, HardDrive, Gamepad2, ChevronRight, User, BookOpen, GraduationCap, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import PageNav from '../../../components/PageNav/PageNav';
import { useTranslation } from 'react-i18next';

export default function SimulationPlatform() {
  const { t } = useTranslation();
  const downloadUrl = import.meta.env.VITE_SIM_APP_DOWNLOAD_URL;
  const backupUrl = "https://drive.google.com/drive/folders/1HkizMPbZkJCS9J9CVFIezedCAEBniH4E?usp=drive_link";
  const [downloading, setDownloading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setMetaLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = useCallback(() => {
    if (!downloadUrl) {
      setError(t('simulator.error.downloadUrlNotConfigured'));
      return;
    }
    setError('');
    setDownloading(true);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.rel = 'noopener';
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => setDownloading(false), 1500);
  }, [downloadUrl, t]);

  const systemRequirements = [
    { icon: Monitor, label: 'OS', value: 'Windows 10/11 (64-bit)' },
    { icon: Cpu, label: 'Processor', value: 'Intel i5 or AMD equivalent' },
    { icon: HardDrive, label: 'Storage', value: '2GB available space' },
    { icon: Gamepad2, label: 'GPU', value: 'DirectX 11 compatible' },
  ];

  // Installation steps - Download and run EXE
  const installationSteps = [
    {
      step: 1,
      icon: Download,
      title: 'Tải ứng dụng mô phỏng',
      description: 'Nhấn nút <strong>"Tải Xuống"</strong> ở trên để tải file cài đặt về máy tính. Hoặc sử dụng link Google Drive để tải backup.',
    },
    {
      step: 2,
      icon: PlayCircle,
      title: 'Chạy file EXE',
      description: 'Sau khi tải xong, tìm file <strong>.exe</strong> trong thư mục Downloads và nhấn đúp để chạy ứng dụng.',
    },
    {
      step: 3,
      icon: Settings,
      title: 'Cho phép chạy ứng dụng',
      description: 'Nếu Windows hiển thị cảnh báo, nhấn <strong>"More info"</strong> rồi chọn <strong>"Run anyway"</strong> để tiếp tục.',
    },
  ];

  // Usage steps - Login and select simulation
  const usageSteps = [
    {
      step: 1,
      icon: User,
      title: 'Đăng nhập tài khoản',
      description: 'Sau khi ứng dụng khởi động, màn hình đăng nhập sẽ hiển thị. Nhập <strong>tài khoản</strong> và <strong>mật khẩu</strong> của bạn để đăng nhập.',
      image: '/images/sim-login.png',
    },
    {
      step: 2,
      icon: BookOpen,
      title: 'Chọn Bài tập hoặc Bài thi',
      description: 'Sau khi đăng nhập thành công, bạn sẽ thấy 2 tùy chọn: <strong>"Bài tập"</strong> (Practice) để luyện tập hoặc <strong>"Bài thi"</strong> (Exam) để làm bài kiểm tra.',
      options: ['Bài tập (Practice)', 'Bài thi (Exam)'],
    },
    {
      step: 3,
      icon: GraduationCap,
      title: 'Chọn lớp học',
      description: 'Danh sách các lớp bạn đang tham gia sẽ hiển thị. Chọn <strong>lớp học</strong> mà bạn muốn thực hành hoặc thi.',
    },
    {
      step: 4,
      icon: Layers,
      title: 'Chọn bài mô phỏng',
      description: 'Cuối cùng, chọn <strong>bài mô phỏng</strong> cụ thể mà bạn cần thực hiện từ danh sách các bài được giao.',
    },
    {
      step: 5,
      icon: CheckCircle,
      title: 'Bắt đầu mô phỏng',
      description: 'Nhấn <strong>"Bắt đầu"</strong> để vào môi trường mô phỏng 3D và thực hiện các thao tác theo yêu cầu bài.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Industrial Style */}
      <section className="relative bg-black text-white py-16 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/simulator-background.jpg";
            }}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative max-w-7xl mx-auto px-6">
          <PageNav
            nameMap={{ simulator: t('header.simulator') }}
            className="mb-6 [&_a]:text-white/80 [&_a:hover]:text-yellow-400 [&_span]:text-white [&_svg]:text-white/60"
          />

          <div className="mb-4 flex items-center gap-4">
            <span className="text-sm tracking-widest text-white uppercase font-bold" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              LSSCTC ACADEMY
            </span>
            <span className="h-1 w-1 rounded-full bg-yellow-400" />
            <span className="px-4 py-1 bg-yellow-400 text-black text-xs font-bold tracking-wider uppercase">
              {t('simulator.badge', '3D Simulation')}
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-black uppercase tracking-tight mb-6 text-white drop-shadow-xl" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.9)' }}>
            {t('simulator.title')}
          </h1>

          <p className="text-xl text-white max-w-2xl mb-10 leading-relaxed font-medium drop-shadow-lg" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
            {t('simulator.subtitle')}
          </p>

          {/* Download CTA */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={handleDownload}
              disabled={metaLoading || !downloadUrl || downloading}
              className="h-14 inline-flex items-center justify-center px-8 bg-yellow-400 text-black font-bold uppercase tracking-wider hover:bg-white transition-colors gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-5 h-5" />
              {downloadUrl ? (downloading ? t('simulator.download.preparing') : t('simulator.download.downloadButton')) : t('simulator.download.unavailable')}
            </button>
            <a
              href={backupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="h-14 inline-flex items-center justify-center px-8 border-2 border-yellow-400 text-yellow-400 font-bold uppercase tracking-wider hover:bg-yellow-400 hover:text-black transition-all gap-2"
            >
              <ExternalLink className="w-5 h-5" />
              {t('simulator.backup.button')}
            </a>
          </div>
        </div>
      </section>

      {/* Download Info Section */}
      <section className="bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {error && <Alert type="error" showIcon className="mb-6" message={error} />}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Latest Build Info */}
            <div className="bg-white border-2 border-neutral-900 p-6">
              <div className="h-2 bg-yellow-400 -mx-6 -mt-6 mb-6" />
              {metaLoading ? (
                <div className="space-y-3">
                  <Skeleton.Button active size="large" style={{ width: 220 }} />
                  <Skeleton active paragraph={{ rows: 2 }} title={false} />
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2 mb-4">
                    <Laptop2 className="w-5 h-5 text-yellow-500" />
                    {t('simulator.download.latestBuild')}
                  </h2>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-3 py-1 bg-yellow-400 text-black font-bold uppercase tracking-wider">
                      v1.0.0
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-700 font-bold">
                      450MB
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 text-neutral-700 font-bold">
                      Windows 10/11 (64-bit)
                    </span>
                  </div>
                </>
              )}

              {!downloadUrl && !metaLoading && (
                <p className="mt-4 text-xs text-amber-600 flex items-center gap-1 bg-amber-50 p-3 border border-amber-200">
                  <Info className="w-4 h-4" />
                  {t('simulator.download.envVarNotSet')} <code className="font-mono bg-amber-100 px-1">VITE_SIM_APP_DOWNLOAD_URL</code> {t('simulator.download.notSet')}
                </p>
              )}
            </div>

            {/* System Requirements */}
            <div className="bg-white border-2 border-neutral-900 p-6">
              <div className="h-2 bg-neutral-900 -mx-6 -mt-6 mb-6" />
              <h3 className="text-xl font-black uppercase tracking-wider text-neutral-900 flex items-center gap-2 mb-4">
                <Cpu className="w-5 h-5 text-yellow-500" />
                {t('simulator.requirements', 'System Requirements')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {systemRequirements.map((req, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center flex-shrink-0">
                      <req.icon className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">{req.label}</div>
                      <div className="text-sm font-bold text-neutral-900">{req.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Installation Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Bước 1
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              Cài đặt ứng dụng
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {metaLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {installationSteps.map((item) => (
                <div
                  key={item.step}
                  className="relative p-6 bg-neutral-50 border-2 border-neutral-900 hover:border-yellow-400 transition-all group"
                >
                  {/* Step number badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-yellow-400 flex items-center justify-center text-black font-black text-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {item.step}
                  </div>

                  {/* Icon */}
                  <div className="mt-4 mb-4 flex justify-center">
                    <div className="w-16 h-16 bg-neutral-900 flex items-center justify-center">
                      <item.icon className="w-8 h-8 text-yellow-400" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-black uppercase text-neutral-900 mb-2 text-center">
                    {item.title}
                  </h3>
                  <p
                    className="text-neutral-600 text-sm text-center leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: item.description }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Usage Guide - New Flow */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Bước 2
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              Hướng dẫn sử dụng
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {metaLoading ? (
            <Skeleton active paragraph={{ rows: 6 }} />
          ) : (
            <div className="space-y-6">
              {usageSteps.map((item, index) => (
                <div
                  key={item.step}
                  className="relative flex items-start gap-6 p-6 bg-white border-2 border-neutral-200 hover:border-yellow-400 transition-all group"
                >
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 bg-yellow-400 flex items-center justify-center flex-shrink-0 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <item.icon className="w-7 h-7 text-black" />
                    </div>
                    {index < usageSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-neutral-300 mt-4 min-h-[40px]" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-2">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-0.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider">
                        Bước {item.step}
                      </span>
                      <h3 className="text-xl font-black uppercase text-neutral-900">
                        {item.title}
                      </h3>
                    </div>
                    <p
                      className="text-neutral-600 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />

                    {/* Options if available */}
                    {item.options && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {item.options.map((option, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 border border-neutral-300 text-neutral-700 font-semibold text-sm"
                          >
                            <ArrowRight className="w-4 h-4 text-yellow-500" />
                            {option}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Flow Summary */}
          <div className="mt-10 p-6 bg-black text-white">
            <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />
            <h4 className="text-lg font-black uppercase mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-yellow-400" />
              Tóm tắt quy trình
            </h4>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <span className="px-3 py-1.5 bg-yellow-400 text-black font-bold">Đăng nhập</span>
              <ArrowRight className="w-4 h-4 text-yellow-400" />
              <span className="px-3 py-1.5 bg-neutral-800 text-white font-bold border border-neutral-600">Chọn Bài tập/Thi</span>
              <ArrowRight className="w-4 h-4 text-yellow-400" />
              <span className="px-3 py-1.5 bg-neutral-800 text-white font-bold border border-neutral-600">Chọn Lớp</span>
              <ArrowRight className="w-4 h-4 text-yellow-400" />
              <span className="px-3 py-1.5 bg-neutral-800 text-white font-bold border border-neutral-600">Chọn Bài mô phỏng</span>
              <ArrowRight className="w-4 h-4 text-yellow-400" />
              <span className="px-3 py-1.5 bg-green-500 text-white font-bold">Bắt đầu!</span>
            </div>
          </div>
        </div>
      </section>

      {/* Support Footer */}
      <section className="bg-black text-white py-12 border-t-4 border-yellow-400">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-lg">
            {t('simulator.support.text')} <a className="text-yellow-400 hover:underline font-bold uppercase" href={`mailto:${t('simulator.support.email')}`}>{t('simulator.support.email')}</a>
          </p>
        </div>
      </section>
    </div>
  );
}