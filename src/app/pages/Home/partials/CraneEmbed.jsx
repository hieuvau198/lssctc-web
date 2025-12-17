import React from 'react';
import { useTranslation } from 'react-i18next';

export default function CraneEmbed({ className = '' }) {
  const { t } = useTranslation();
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full aspect-[4/3]">
        <iframe
          title="Howo Crane Manipulator Truck Sunhunk S3005"
          className="absolute inset-0 w-full h-full border-2 border-neutral-900"
          frameBorder="0"
          allow="autoplay; fullscreen"
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-modals"
          src="https://sketchfab.com/models/8ebf8a41e62543169a40869356f10e75/embed?ui_ar=0&ui_help=0&ui_hint=0&ui_infos=0&dnt=1"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-neutral-500 uppercase tracking-wider font-semibold">{t('home.craneEmbed.model', 'Model:')}</span>
          <a
            href="https://sketchfab.com/3d-models/howo-crane-manipulator-truck-sunhunk-s3005-8ebf8a41e62543169a40869356f10e75"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-900 hover:text-yellow-600 font-bold uppercase"
          >Howo Crane Truck</a>
        </div>
        <a
          href="https://sketchfab.com"
          target="_blank"
          rel="noopener noreferrer"
          className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-yellow-400 transition-colors"
        >Sketchfab</a>
      </div>
    </div>
  );
}
