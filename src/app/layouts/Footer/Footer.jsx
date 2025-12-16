import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { ShieldCheck, Mail, Phone, MapPin, Facebook, Youtube, Linkedin, ChevronRight } from 'lucide-react';

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  const quickLinks = [
    { to: "/", label: t('footer.home', 'Trang chủ'), highlight: true },
    { to: "/program", label: t('footer.trainingProgram', 'Chương trình đào tạo') },
    { to: "/simulator", label: t('footer.simulator3D', 'Mô phỏng 3D') },
    { to: "/about", label: t('footer.aboutUs', 'Về chúng tôi') },
    { to: "/contact", label: t('footer.contactUs', 'Liên hệ') },
  ];

  const trainingPrograms = [
    { to: "/program", label: t('footer.basicCrane', 'Vận hành cần cẩu cơ bản') },
    { to: "/program", label: t('footer.advancedCrane', 'Vận hành cần cẩu nâng cao') },
    { to: "/program", label: t('footer.laborSafety', 'An toàn lao động') },
    { to: "/program", label: t('footer.logistics', 'Logistics & Kho vận') },
    { to: "/program", label: t('footer.internationalCert', 'Chứng nhận quốc tế') },
  ];

  return (
    <footer className="mt-auto bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-slate-300 relative overflow-hidden">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-900/10 via-transparent to-blue-900/10 pointer-events-none" />

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30 border border-cyan-400/30">
                <ShieldCheck className="w-7 h-7 text-white" />
              </div>
              <span className="font-bold text-xl text-white tracking-wide">
                LSSCTC
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              {t('footer.description', 'Trung tâm đào tạo vận hành cần cẩu và an toàn logistics hàng đầu Việt Nam với công nghệ mô phỏng 3D tiên tiến.')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/50 hover:bg-cyan-600 hover:border-cyan-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/50 hover:bg-red-600 hover:border-red-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-slate-700/50 border border-slate-600/50 hover:bg-blue-600 hover:border-blue-500 flex items-center justify-center transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-base">
              {t('footer.quickLinks', 'Liên kết nhanh')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to + link.label}>
                  <NavLink
                    to={link.to}
                    className={`group text-sm flex items-center transition-colors duration-200 hover:text-cyan-400 ${link.highlight ? 'text-cyan-400' : 'text-slate-400'
                      }`}
                  >
                    <ChevronRight className="w-0 h-3 group-hover:w-4 group-hover:mr-1 overflow-hidden transition-all duration-200" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Training Programs */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-base">
              {t('footer.trainingPrograms', 'Chương trình đào tạo')}
            </h4>
            <ul className="space-y-3">
              {trainingPrograms.map((link, idx) => (
                <li key={idx}>
                  <NavLink
                    to={link.to}
                    className="group text-slate-400 hover:text-cyan-400 text-sm flex items-center transition-colors duration-200"
                  >
                    <ChevronRight className="w-0 h-3 group-hover:w-4 group-hover:mr-1 overflow-hidden transition-all duration-200" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-base">
              {t('footer.contact', 'Liên hệ')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="text-slate-400 leading-relaxed">
                  {t('footer.address', '7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam')}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="text-slate-400">+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3 h-3 text-cyan-400" />
                </div>
                <span className="text-slate-400">info@lssctc.com</span>
              </li>
            </ul>

            {/* Certifications */}
            <div className="mt-6">
              <p className="text-xs text-slate-500 mb-2">{t('footer.certifiedBy', 'Chứng nhận bởi:')}</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-xs font-medium border border-slate-600 rounded text-slate-300 bg-slate-800/50">
                  ISO 9001:2015
                </span>
                <span className="px-3 py-1.5 text-xs font-medium border border-cyan-600/50 rounded text-cyan-400 bg-cyan-900/30">
                  OSHA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>© {year} LSSCTC. {t('footer.allRightsReserved', 'All rights reserved.')}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-500">
              <NavLink to="/privacy" className="hover:text-cyan-400 transition-colors">
                {t('footer.privacyPolicy', 'Chính sách bảo mật')}
              </NavLink>
              <NavLink to="/terms" className="hover:text-cyan-400 transition-colors">
                {t('footer.termsOfUse', 'Điều khoản sử dụng')}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
