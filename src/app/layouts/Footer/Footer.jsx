import React from 'react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
  <footer className="mt-auto border-t border-t-slate-600 bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row gap-6 md:gap-8 text-sm">
        <div className="flex-1 min-w-[200px]">
          <h3 className="font-semibold text-blue-400 mb-2">LSSCTC</h3>
          <p className="text-slate-400 leading-relaxed">Training & Simulator platform for modern crane operation and logistics safety.</p>
        </div>
        <div>
          <h4 className="font-semibold text-blue-400 mb-2">Explore</h4>
          <ul className="space-y-1">
            <li><a href="/courses" className="hover:text-blue-400">Courses</a></li>
            <li><a href="/schedule" className="hover:text-blue-400">Schedule</a></li>
            <li><a href="/simulator" className="hover:text-blue-400">Simulator</a></li>
            <li><a href="/assessments" className="hover:text-blue-400">Assessments</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-blue-400 mb-2">Support</h4>
          <ul className="space-y-1">
            <li><a href="/faq" className="hover:text-blue-400">FAQ</a></li>
            <li><a href="/support" className="hover:text-blue-400">Support</a></li>
            <li><a href="/terms" className="hover:text-blue-400">Terms</a></li>
            <li><a href="/privacy" className="hover:text-blue-400">Privacy</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold text-blue-400 mb-2">Contact</h4>
          <ul className="space-y-1 text-slate-400">
            <li>Email: contact@lssctc.app</li>
            <li>Phone: +84 000 000 000</li>
          </ul>
        </div>
      </div>
      <div className="bg-slate-900 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 pt-2 pb-4">
          {/* Decorative separator (open ends) */}
          <div className="flex items-center mb-3" aria-hidden>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-500 to-transparent" />
          </div>
          <div className="text-xs text-slate-400 flex flex-col md:flex-row gap-3 md:gap-6 items-center justify-between">
            <span>© {year} LSSCTC. All rights reserved.</span>
            <span className="inline-flex gap-3">
              <a href="#" className="hover:text-blue-400">Facebook</a>
              <a href="#" className="hover:text-blue-400">LinkedIn</a>
              <a href="#" className="hover:text-blue-400">GitHub</a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
