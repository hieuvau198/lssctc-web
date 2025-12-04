import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CraneEmbed({ className = '' }) {
  const { t } = useTranslation();
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full aspect-[5/4] sm:aspect-[4/3] md:aspect-[16/11] lg:aspect-[16/10] xl:aspect-[16/9]">
        <iframe
          title="Howo Crane Manipulator Truck Sunhunk S3005"
          className="absolute inset-0 w-full h-full rounded-xl border border-white/15 shadow-lg"
          frameBorder="0"
          allow="autoplay; fullscreen"
          // Sandbox flags: removed invalid 'allow-autoplay'; minimal needed for Sketchfab viewer
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-modals"
          // Query params disable AR/help overlays; dnt=1 reduces tracking
          src="https://sketchfab.com/models/8ebf8a41e62543169a40869356f10e75/embed?ui_ar=0&ui_help=0&ui_hint=0&ui_infos=0&dnt=1"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/** Note: Permission policy warnings (accelerometer/deviceorientation/xr) may still appear in dev tools because the embedded
         * Sketchfab script probes for sensors. They are safely blocked by browser policy; this does not affect functionality.
         */}
      </div>
  <div className="mt-2 text-[10px] md:text-[11px] text-slate-500 flex flex-wrap gap-1 leading-snug">
        <span>{t('home.craneEmbed.model')}</span>
        <a
          href="https://sketchfab.com/3d-models/howo-crane-manipulator-truck-sunhunk-s3005-8ebf8a41e62543169a40869356f10e75"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >Howo Crane Manipulator Truck Sunhunk S3005</a>
        <span>{t('home.craneEmbed.by')}</span>
        <a
          href="https://sketchfab.com/Anastenko"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >A Nastenko</a>
        <span>{t('home.craneEmbed.on')}</span>
        <a
          href="https://sketchfab.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-700"
        >Sketchfab</a>
      </div>
    </div>
  );
}
