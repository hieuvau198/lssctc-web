import React from 'react';

export default function CraneEmbed({ className = '' }) {
  return (
    <div className={`relative w-full ${className}`}>
      <div className="relative w-full aspect-[5/4] sm:aspect-[4/3] md:aspect-[16/11] lg:aspect-[16/10] xl:aspect-[16/9]">
        <iframe
          title="LTM 1070-4-2 Mobile Crane"
          className="absolute inset-0 w-full h-full rounded-xl border border-white/15 shadow-lg"
          frameBorder="0"
          allow="autoplay; fullscreen"
          // Sandbox flags: removed invalid 'allow-autoplay'; minimal needed for Sketchfab viewer
          sandbox="allow-scripts allow-same-origin allow-pointer-lock allow-modals"
          // Query params disable AR/help overlays; dnt=1 reduces tracking
          src="https://sketchfab.com/models/3f25fdc6bb3d4a1cae439279ac35b9a5/embed?ui_ar=0&ui_help=0&ui_hint=0&ui_infos=0&dnt=1"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
        {/** Note: Permission policy warnings (accelerometer/deviceorientation/xr) may still appear in dev tools because the embedded
         * Sketchfab script probes for sensors. They are safely blocked by browser policy; this does not affect functionality.
         */}
      </div>
  <div className="mt-2 text-[10px] md:text-[11px] text-slate-500 flex flex-wrap gap-1 leading-snug">
        <span>Model:</span>
        <a
          href="https://sketchfab.com/3d-models/ltm-1070-4-2-mobile-crane-3f25fdc6bb3d4a1cae439279ac35b9a5"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >LTM 1070-4-2 Mobile Crane</a>
        <span>by</span>
        <a
          href="https://sketchfab.com/Markos.3d"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >Markos3d</a>
        <span>on</span>
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
