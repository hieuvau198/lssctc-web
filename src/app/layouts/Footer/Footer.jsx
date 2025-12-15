import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { GraduationCap, Mail, Phone, Facebook, Linkedin, Github, ExternalLink } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const exploreLinks = [
    { to: "/program", label: t('footer.courses') },
    { to: "/schedule", label: t('footer.schedule') },
    { to: "/simulator", label: t('footer.simulator') },
  ];

  const supportLinks = [
    { to: "/faq", label: t('footer.faq') },
    { to: "/support", label: t('footer.supportLink') },
    { to: "/terms", label: t('footer.terms') },
    { to: "/privacy", label: t('footer.privacy') },
  ];

  return (
    <footer className="mt-auto bg-gradient-to-b from-slate-900 to-slate-950 text-slate-300">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                LSSCTC
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-4">
              {t('footer.description')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-cyan-600 flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-cyan-500/20"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-blue-600 flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-600 flex items-center justify-center transition-all duration-200 hover:shadow-lg"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              {t('footer.explore')}
            </h4>
            <ul className="space-y-2.5">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-slate-400 hover:text-cyan-400 text-sm flex items-center gap-2 transition-colors duration-200 group"
                  >
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              {t('footer.support')}
            </h4>
            <ul className="space-y-2.5">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <NavLink
                    to={link.to}
                    className="text-slate-400 hover:text-cyan-400 text-sm flex items-center gap-2 transition-colors duration-200 group"
                  >
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
              <div className="w-1 h-4 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-full"></div>
              {t('footer.contact')}
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Mail className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-400">contact@lssctc.app</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-cyan-400" />
                </div>
                <span className="text-slate-400">+84 000 000 000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <span className="text-xs text-slate-500">
              © {year} LSSCTC. {t('footer.allRightsReserved')}
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <span>Made with</span>
              <span className="text-red-500">❤</span>
              <span>in Viet Nam</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
