import React, { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router";
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import Avt from "./partials/Avt";
import { clearRememberedCredentials } from "../../libs/crypto";
import { Button } from "antd";
import LanguageSwitcher from "../../components/LanguageSwitcher";
import { Menu, X, GraduationCap, Home, BookOpen, Monitor, Info } from "lucide-react";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScroll = useRef(0);
  const [hasToken, setHasToken] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
      if (y > lastScroll.current && y > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      lastScroll.current = y;
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
    { to: "/", label: t('common.home'), icon: Home },
    { to: "/program", label: t('header.programs'), icon: BookOpen },
    { to: "/simulator", label: t('header.simulator'), icon: Monitor },
    { to: "/about", label: t('header.about'), icon: Info },
  ];

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50",
        "transition-all duration-300",
        atTop
          ? "bg-white/80 backdrop-blur-md border-b border-transparent"
          : "bg-white/95 backdrop-blur-md shadow-lg shadow-slate-200/50 border-b border-slate-200/60",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-2">
        <div className="flex items-center justify-between h-16 gap-4 relative">
          {/* Left cluster: hamburger + logo */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl border border-slate-200 text-slate-600 hover:text-cyan-600 hover:border-cyan-300 hover:bg-cyan-50 bg-white/80 backdrop-blur-sm transition-all duration-200"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <NavLink to="/" className="flex items-center gap-2.5 shrink-0 group">
              <span className="hidden md:inline font-bold text-lg bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent select-none">
                LSSCTC
              </span>
            </NavLink>
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    className={({ isActive }) => [
                      "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-2",
                      isActive
                        ? "text-cyan-700 bg-cyan-50 border border-cyan-200"
                        : "text-slate-600 hover:text-cyan-600 hover:bg-slate-50 border border-transparent"
                    ].join(" ")}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
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
                type="primary"
                className="shadow-lg shadow-cyan-200/50"
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
              "bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg shadow-slate-200/50",
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
                  onClick={() => setMobileOpen(false)}
                  to={item.to}
                  className={({ isActive }) => [
                    "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200",
                    isActive
                      ? "text-cyan-700 bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200"
                      : "text-slate-600 hover:text-cyan-600 hover:bg-slate-50 border border-transparent"
                  ].join(" ")}
                >
                  <item.icon className="w-5 h-5" />
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
