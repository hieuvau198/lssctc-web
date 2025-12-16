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
    <footer className="mt-auto bg-black text-white">
      {/* Yellow accent bar */}
      <div className="h-1 bg-yellow-400" />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-12 w-12 bg-yellow-400 flex items-center justify-center">
                <ShieldCheck className="w-7 h-7 text-black" />
              </div>
              <span className="font-black text-2xl text-white uppercase tracking-wide">
                LSSCTC
              </span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              {t('footer.description', 'Trung tâm đào tạo vận hành cần cẩu và an toàn logistics hàng đầu Việt Nam với công nghệ mô phỏng 3D tiên tiến.')}
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-10 h-10 border-2 border-neutral-700 hover:bg-yellow-400 hover:border-yellow-400 flex items-center justify-center transition-all duration-300 group"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4 text-neutral-400 group-hover:text-black" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border-2 border-neutral-700 hover:bg-yellow-400 hover:border-yellow-400 flex items-center justify-center transition-all duration-300 group"
                aria-label="YouTube"
              >
                <Youtube className="w-4 h-4 text-neutral-400 group-hover:text-black" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border-2 border-neutral-700 hover:bg-yellow-400 hover:border-yellow-400 flex items-center justify-center transition-all duration-300 group"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4 text-neutral-400 group-hover:text-black" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-5 bg-yellow-400" />
              {t('footer.quickLinks', 'Liên kết nhanh')}
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.to + link.label}>
                  <NavLink
                    to={link.to}
                    className={`group text-sm flex items-center transition-colors duration-200 hover:text-yellow-400 ${link.highlight ? 'text-yellow-400' : 'text-neutral-400'
                      }`}
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Training Programs */}
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-5 bg-yellow-400" />
              {t('footer.trainingPrograms', 'Chương trình đào tạo')}
            </h4>
            <ul className="space-y-3">
              {trainingPrograms.map((link, idx) => (
                <li key={idx}>
                  <NavLink
                    to={link.to}
                    className="group text-neutral-400 hover:text-yellow-400 text-sm flex items-center transition-colors duration-200"
                  >
                    <ChevronRight className="w-4 h-4 mr-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-black text-white mb-6 uppercase tracking-wider flex items-center gap-2">
              <div className="w-1 h-5 bg-yellow-400" />
              {t('footer.contact', 'Liên hệ')}
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-neutral-400 leading-relaxed">
                  {t('footer.address', '7 Đ. D1, Long Thạnh Mỹ, Thủ Đức, Thành phố Hồ Chí Minh, Việt Nam')}
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-neutral-400">+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-neutral-900 border border-neutral-700 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 text-yellow-400" />
                </div>
                <span className="text-neutral-400">info@lssctc.com</span>
              </li>
            </ul>

            {/* Certifications */}
            <div className="mt-6">
              <p className="text-xs text-neutral-500 mb-2 uppercase tracking-wider">{t('footer.certifiedBy', 'Chứng nhận bởi:')}</p>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 text-xs font-bold border-2 border-neutral-700 text-neutral-300 uppercase tracking-wider">
                  ISO 9001:2015
                </span>
                <span className="px-3 py-1.5 text-xs font-bold bg-yellow-400 text-black uppercase tracking-wider">
                  OSHA
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-wider">
              <span>© {year} LSSCTC. {t('footer.allRightsReserved', 'All rights reserved.')}</span>
            </div>
            <div className="flex items-center gap-6 text-xs text-neutral-500 uppercase tracking-wider">
              <NavLink to="/privacy" className="hover:text-yellow-400 transition-colors">
                {t('footer.privacyPolicy', 'Chính sách bảo mật')}
              </NavLink>
              <NavLink to="/terms" className="hover:text-yellow-400 transition-colors">
                {t('footer.termsOfUse', 'Điều khoản sử dụng')}
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
