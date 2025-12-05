import React, { useCallback, useEffect, useState } from 'react';
import { Button, Skeleton, Alert, Tabs } from 'antd'; // <-- Import Tabs
import { Download, Info, Laptop2, Settings, PlayCircle, ExternalLink } from 'lucide-react'; // <-- Import ExternalLink
import PageNav from '../../../components/PageNav/PageNav';
import { useTranslation } from 'react-i18next';

/**
 * SimulationPlatform page
 * - Provides a download entry for native 3D simulator application.
 * - Displays installation & usage instructions (placeholder content).
 * - Uses env var VITE_SIM_APP_DOWNLOAD_URL (no hard-coded URL).
 * - Includes lightweight skeleton states per project guideline.
 */
export default function SimulationPlatform() {
  const { t } = useTranslation();
  const downloadUrl = import.meta.env.VITE_SIM_APP_DOWNLOAD_URL; // e.g. https://cdn.example.com/sim/LSSCTC-Simulator-Setup.exe
  const backupUrl = "https://drive.google.com/drive/folders/1HkizMPbZkJCS9J9CVFIezedCAEBniH4E?usp=drive_link";
  const [downloading, setDownloading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState('');

  // Simulate tiny metadata loading (future: fetch latest version / release notes)
  useEffect(() => {
    const t = setTimeout(() => setMetaLoading(false), 400);
    return () => clearTimeout(t);
  }, []);

  const handleDownload = useCallback(() => {
    if (!downloadUrl) {
      setError(t('simulator.error.downloadUrlNotConfigured'));
      return;
    }
    setError('');
    setDownloading(true);
    // Create hidden link to trigger browser download
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.rel = 'noopener';
    a.download = '';
    document.body.appendChild(a);
    a.click();
    a.remove();
    // Fallback end of state (cannot detect native download completion reliably)
    setTimeout(() => setDownloading(false), 1500);
  }, [downloadUrl, t]);

  // Tab definitions
  const tabItems = [
    {
      key: '1',
      label: t('simulator.download.tabTitle'),
      children: (
        <div className="flex flex-col md:flex-row md:items-center gap-5 pt-4">
          <div className="flex-1 min-w-0">
            {metaLoading ? (
              <div className="space-y-3">
                <Skeleton.Button active size="large" style={{ width: 220 }} />
                <Skeleton active paragraph={{ rows: 2 }} title={false} />
              </div>
            ) : (
              <>
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                  <Laptop2 className="w-5 h-5 text-blue-600" /> {t('simulator.download.latestBuild')}
                </h2>
                <p className="text-sm text-slate-600 mt-1">{t('simulator.download.version')}: <span className="font-medium">v1.0.0</span> • {t('simulator.download.approxSize')}: 450MB • {t('simulator.download.platform')}: Windows 10/11 (64-bit)</p>
              </>
            )}
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <Button
              type="primary"
              size="large"
              icon={<Download className="w-4 h-4" />}
              loading={downloading}
              disabled={metaLoading || !downloadUrl}
              onClick={handleDownload}
            >
              {downloadUrl ? (downloading ? t('simulator.download.preparing') : t('simulator.download.downloadButton')) : t('simulator.download.unavailable')}
            </Button>
          </div>
        </div>
      )
    },
    {
      key: '2',
      label: t('simulator.backup.tabTitle'),
      children: (
        <div className="flex flex-col md:flex-row md:items-center gap-5 pt-4">
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-green-600" /> {t('simulator.backup.title')}
            </h2>
            <p className="text-sm text-slate-600 mt-1">{t('simulator.backup.description')}</p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-3">
            <Button
              type="default"
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

  return (
    <div className="bg-white ">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageNav nameMap={{ simulator: t('header.simulator') }} />
        <header className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-2">{t('simulator.title')}</h1>
          <p className="text-slate-600 max-w-2xl text-sm sm:text-base">{t('simulator.subtitle')}</p>
        </header>

        <div className="flex flex-col gap-6 mb-12">
          <div className="rounded-xl border border-slate-200 p-6 bg-gradient-to-br from-slate-50 to-white">
            {error && <Alert type="error" showIcon className="mb-4" message={error} />}
            
            {/* --- THAY THẾ BẰNG TABS --- */}
            <Tabs defaultActiveKey="1" items={tabItems} />
            {/* --- KẾT THÚC THAY THẾ --- */}
            
            {!downloadUrl && !metaLoading && (
              <p className="mt-3 text-xs text-amber-600 flex items-center gap-1"><Info className="w-4 h-4" /> {t('simulator.download.envVarNotSet')} <code className="font-mono">VITE_SIM_APP_DOWNLOAD_URL</code> {t('simulator.download.notSet')}</p>
            )}
          </div>
        </div>

        <section className="mb-12">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><Settings className="w-5 h-5 text-blue-600" /> {t('simulator.installation.title')}</h3>
          {metaLoading ? (
            <div className="space-y-4">
              <Skeleton active paragraph={{ rows: 3 }} />
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          ) : (
            <ol className="list-decimal pl-5 space-y-3 text-sm text-slate-700">
              <li dangerouslySetInnerHTML={{ __html: t('simulator.installation.step1') }} />
              <li dangerouslySetInnerHTML={{ __html: t('simulator.installation.step2') }} />
              <li dangerouslySetInnerHTML={{ __html: t('simulator.installation.step3') }} />
              <li dangerouslySetInnerHTML={{ __html: t('simulator.installation.step4') }} />
              <li dangerouslySetInnerHTML={{ __html: t('simulator.installation.step5') }} />
            </ol>
          )}
        </section>

        <section className="mb-12">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2"><PlayCircle className="w-5 h-5 text-blue-600" /> {t('simulator.usage.title')}</h3>
          {metaLoading ? (
            <Skeleton active paragraph={{ rows: 4 }} />
          ) : (
            <div className="prose max-w-none text-sm leading-relaxed text-slate-700">
              <p dangerouslySetInnerHTML={{ __html: t('simulator.usage.intro') }} />
              <ul className="list-disc pl-5 space-y-1">
                <li dangerouslySetInnerHTML={{ __html: t('simulator.usage.controlsMapping') }} />
                <li dangerouslySetInnerHTML={{ __html: t('simulator.usage.telemetryPanel') }} />
                <li dangerouslySetInnerHTML={{ __html: t('simulator.usage.assessmentMode') }} />
                <li dangerouslySetInnerHTML={{ __html: t('simulator.usage.replay') }} />
              </ul>
              <p className="mt-4" dangerouslySetInnerHTML={{ __html: t('simulator.usage.advanced') }} />
            </div>
          )}
        </section>

        <footer className="pb-4">
          <p className="text-xs text-slate-500">{t('simulator.support.text')} <a className="underline" href={`mailto:${t('simulator.support.email')}`}>{t('simulator.support.email')}</a> {t('simulator.support.withDetails')} (<code className="font-mono">logs/latest.txt</code>).</p>
        </footer>
      </div>
    </div>
  );
}