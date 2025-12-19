import { Button } from "antd";
import Cookies from 'js-cookie';
import { BookOpen, Home, Info, Menu, Monitor, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { NavLink, useNavigate } from "react-router";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { clearRememberedCredentials } from "../../libs/crypto";
import Avt from "./partials/Avt";

export default function Header() {
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  useEffect(() => {
    const check = () => setHasToken(!!Cookies.get('token'));
    check();
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  const navItems = [
    { to: "/", label: t('common.home') },
    { to: "/program", label: t('header.programs') },
    { to: "/simulator", label: t('header.simulator') },
    { to: "/about", label: t('header.about') },
  ];

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-300",
        atTop
          ? "bg-white border-b border-transparent"
          : "bg-white border-b border-neutral-200",
      ].join(" ")}
    >
      {/* Yellow accent bar */}
      <div className="h-1 bg-yellow-400" />

      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4 relative">
          {/* Left cluster: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 border-2 border-neutral-900 text-neutral-900 hover:bg-yellow-400 hover:border-yellow-400 transition-all duration-200"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
              <span className="font-black text-xl text-black uppercase tracking-wider">
                LSSCTC
              </span>
            </NavLink>
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center justify-center flex-1 pt-2">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    onClick={() => window.scrollTo({ top: 0 })}
                    className={({ isActive }) => [
                      "px-4 py-2 text-sm font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border-b-2",
                      isActive
                        ? "border-yellow-400 text-black"
                        : "border-transparent text-neutral-600 hover:text-black hover:border-neutral-300"
                    ].join(" ")}
                  >
                    <span>{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {hasToken ? (
              <Avt onLogout={() => {
                Cookies.remove('token', { path: '/' });
                try { clearRememberedCredentials(); } catch { }
                setHasToken(false);
              }} />
            ) : (
              <Button
                onClick={() => navigate('/auth/login')}
                className="!bg-yellow-400 !text-black !border-yellow-400 !font-bold !uppercase !tracking-wider hover:!bg-black hover:!text-yellow-400 hover:!border-black !shadow-none"
              >
                {t('common.signIn')}
              </Button>
            )}
            <LanguageSwitcher />
          </div>

          {/* Mobile panel */}
          <div
            className={[
              "md:hidden absolute top-full left-0 right-0 origin-top overflow-hidden",
              "bg-white border-b-2 border-neutral-900",
              "transition-all duration-300",
              mobileOpen
                ? "opacity-100 pointer-events-auto translate-y-0"
                : "opacity-0 pointer-events-none -translate-y-2",
            ].join(" ")}
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  onClick={() => { setMobileOpen(false); window.scrollTo({ top: 0 }); }}
                  to={item.to}
                  className={({ isActive }) => [
                    "flex items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-wider transition-all duration-200 border-l-4",
                    isActive
                      ? "border-yellow-400 text-black bg-neutral-50"
                      : "border-transparent text-neutral-600 hover:text-black hover:bg-neutral-50 hover:border-neutral-300"
                  ].join(" ")}
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
