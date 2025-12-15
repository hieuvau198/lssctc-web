import React, { useCallback, useEffect, useState } from 'react';
import { Button, Skeleton, Alert, Tabs } from 'antd';
import { Download, Info, Laptop2, Settings, PlayCircle, ExternalLink, Monitor, Cpu, HardDrive, Gamepad2 } from 'lucide-react';
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

  const tabItems = [
    {
      key: '1',
      label: (
        <span className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          {t('simulator.download.tabTitle')}
        </span>
      ),
      children: (
        <div className="flex flex-col md:flex-row md:items-center gap-6 pt-6">
          <div className="flex-1 min-w-0">
            {metaLoading ? (
              <div className="space-y-3">
                <Skeleton.Button active size="large" style={{ width: 220 }} />
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-2">
                  <Laptop2 className="w-5 h-5 text-cyan-600" />
                  {t('simulator.download.latestBuild')}
                </h2>
                <div className="flex flex-wrap gap-3 text-sm">
                  <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full font-medium">
                    v1.0.0
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                    450MB
                  </span>
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                    Windows 10/11 (64-bit)
                  </span>
                </div>
              </>
            )}
          </div>
          <div className="flex-shrink-0">
            <Button
              type="primary"
              size="large"
              icon={<Download className="w-4 h-4" />}
              loading={downloading}
              disabled={metaLoading || !downloadUrl}
              onClick={handleDownload}
              className="shadow-lg shadow-cyan-200/50"
            >
              {downloadUrl ? (downloading ? t('simulator.download.preparing') : t('simulator.download.downloadButton')) : t('simulator.download.unavailable')}
            </Button>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: (
        <span className="flex items-center gap-2">
          <ExternalLink className="w-4 h-4" />
          {t('simulator.backup.tabTitle')}
        </span>
      ),
      children: (
        <div className="flex flex-col md:flex-row md:items-center gap-6 pt-6">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2 mb-2">
              <ExternalLink className="w-5 h-5 text-emerald-600" />
              {t('simulator.backup.title')}
            </h2>
            <p className="text-sm text-slate-600">{t('simulator.backup.description')}</p>
          </div>
          <div className="flex-shrink-0">
            <Button
              size="large"
              icon={<ExternalLink className="w-4 h-4" />}
              href={backupUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('simulator.backup.button')}
            </Button>
          </div>
        </div>
      )
    }
  ];

  const systemRequirements = [
    { icon: Monitor, label: 'OS', value: 'Windows 10/11 (64-bit)' },
    { icon: Cpu, label: 'Processor', value: 'Intel i5 or AMD equivalent' },
    { icon: HardDrive, label: 'Storage', value: '2GB available space' },
    { icon: Gamepad2, label: 'GPU', value: 'DirectX 11 compatible' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageNav nameMap={{ simulator: t('header.simulator') }} />

        {/* Hero Header */}
        <header className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-medium mb-4">
            <Monitor className="w-4 h-4" />
            {t('simulator.badge', '3D Simulation')}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-3">
            {t('simulator.title')}
          </h1>
          <p className="text-slate-600 max-w-2xl text-base sm:text-lg">
            {t('simulator.subtitle')}
          </p>
        </header>

        {/* Download Card */}
        <div className="mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="h-1 bg-gradient-to-r from-cyan-400 to-blue-500" />
            <div className="p-6">
              {error && <Alert type="error" showIcon className="mb-4" message={error} />}
              <Tabs defaultActiveKey="1" items={tabItems} />

              {!downloadUrl && !metaLoading && (
                <p className="mt-4 text-xs text-amber-600 flex items-center gap-1 bg-amber-50 p-3 rounded-lg">
                  <Info className="w-4 h-4" />
                  {t('simulator.download.envVarNotSet')} <code className="font-mono bg-amber-100 px-1 rounded">VITE_SIM_APP_DOWNLOAD_URL</code> {t('simulator.download.notSet')}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* System Requirements */}
        <div className="mb-10">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-600" />
            {t('simulator.requirements', 'System Requirements')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {systemRequirements.map((req, i) => (
              <div key={i} className="bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-slate-200 hover:border-cyan-200 hover:shadow-lg transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                    <req.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">{req.label}</div>
                    <div className="text-sm font-medium text-slate-800">{req.value}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Guide */}
        <section className="mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-cyan-50/50 to-blue-50/50">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-cyan-600" />
                {t('simulator.installation.title')}
              </h3>
            </div>
            <div className="p-6">
              {metaLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <ol className="space-y-4">
                  {[1, 2, 3, 4, 5].map((step) => (
                    <li key={step} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 text-white text-sm font-bold">
                        {step}
                      </div>
                      <p
                        className="text-slate-700 pt-1 text-sm"
                        dangerouslySetInnerHTML={{ __html: t(`simulator.installation.step${step}`) }}
                      />
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </section>

        {/* Usage Guide */}
        <section className="mb-10">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-cyan-50/50 to-blue-50/50">
              <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-cyan-600" />
                {t('simulator.usage.title')}
              </h3>
            </div>
            <div className="p-6">
              {metaLoading ? (
                <Skeleton active paragraph={{ rows: 4 }} />
              ) : (
                <div className="prose max-w-none text-sm leading-relaxed text-slate-700">
                  <p dangerouslySetInnerHTML={{ __html: t('simulator.usage.intro') }} />
                  <ul className="mt-4 space-y-2">
                    {['controlsMapping', 'telemetryPanel', 'assessmentMode', 'replay'].map((key) => (
                      <li key={key} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                        <span dangerouslySetInnerHTML={{ __html: t(`simulator.usage.${key}`) }} />
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 p-4 bg-cyan-50 rounded-xl border border-cyan-100" dangerouslySetInnerHTML={{ __html: t('simulator.usage.advanced') }} />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Support Footer */}
        <footer className="pb-4">
          <div className="bg-slate-100 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-600">
              {t('simulator.support.text')} <a className="text-cyan-600 hover:underline font-medium" href={`mailto:${t('simulator.support.email')}`}>{t('simulator.support.email')}</a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}