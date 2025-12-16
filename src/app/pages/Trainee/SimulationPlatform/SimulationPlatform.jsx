import React, { useCallback, useEffect, useState } from 'react';
import { Button, Skeleton, Alert, Tabs } from 'antd';
import { Download, Info, Laptop2, Settings, PlayCircle, ExternalLink, Monitor, Cpu, HardDrive, Gamepad2, ChevronRight } from 'lucide-react';
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
              Hướng dẫn
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              {t('simulator.installation.title')}
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {metaLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <div className="space-y-4 max-w-3xl">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-start gap-4 p-4 bg-neutral-50 border-2 border-neutral-900 hover:border-yellow-400 transition-all group">
                  <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center flex-shrink-0 text-black font-black text-lg">
                    {step}
                  </div>
                  <p
                    className="text-neutral-700 pt-2 text-sm leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: t(`simulator.installation.step${step}`) }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Usage Guide */}
      <section className="py-16 bg-neutral-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <span className="text-sm tracking-widest text-neutral-500 uppercase font-bold block mb-2">
              Cách sử dụng
            </span>
            <h2 className="text-4xl font-black uppercase tracking-tight mb-2">
              {t('simulator.usage.title')}
            </h2>
            <div className="h-1 w-24 bg-yellow-400" />
          </div>

          {metaLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <div className="max-w-3xl">
              <p className="text-neutral-700 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: t('simulator.usage.intro') }} />
              <ul className="space-y-3">
                {['controlsMapping', 'telemetryPanel', 'assessmentMode', 'replay'].map((key) => (
                  <li key={key} className="flex items-start gap-3 p-3 bg-white border-l-4 border-yellow-400">
                    <div className="w-6 h-6 bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <ChevronRight className="w-4 h-4 text-black" />
                    </div>
                    <span className="text-neutral-700" dangerouslySetInnerHTML={{ __html: t(`simulator.usage.${key}`) }} />
                  </li>
                ))}
              </ul>
              <div className="mt-6 p-6 bg-black text-white">
                <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
                <p dangerouslySetInnerHTML={{ __html: t('simulator.usage.advanced') }} />
              </div>
            </div>
          )}
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