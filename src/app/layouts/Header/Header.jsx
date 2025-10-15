import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router";
import Cookies from 'js-cookie';
import Avt from "./partials/Avt";
import { clearRememberedCredentials } from "../../lib/crypto";

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScroll = useRef(0);
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setAtTop(y < 8);
      if (y > lastScroll.current && y > 80) {
        setHidden(true); // scrolling down
      } else {
        setHidden(false); // scrolling up
      }
      lastScroll.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change (NavLink automatically updates). Use MutationObserver fallback if needed.
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  // Check token in Cookies to toggle avatar
  useEffect(() => {
    const check = () => setHasToken(!!Cookies.get('token'));
    check();
    // Re-check when tab gains focus or visibility changes since cookies have no event
    window.addEventListener('focus', check);
    document.addEventListener('visibilitychange', check);
    return () => {
      window.removeEventListener('focus', check);
      document.removeEventListener('visibilitychange', check);
    };
  }, []);

  const linkBase = "px-3 text-sm font-medium transition-colors";
  const getLinkClass = ({ isActive }) =>
    [
      linkBase,
      isActive ? "text-blue-600" : "text-gray-600 hover:text-blue-600",
    ].join(" ");

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 backdrop-blur",
        "transition-transform duration-300 border-b border-b-gray-300",
        atTop ? "bg-white/90" : "bg-white shadow-sm",
        hidden ? "-translate-y-full" : "translate-y-0",
      ].join(" ")}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4 relative">
          {/* Left cluster: hamburger + logo */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 text-gray-600 hover:text-blue-600 hover:border-blue-400 bg-white/70 backdrop-blur-sm transition"
            >
              {mobileOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M3 12h18" />
                  <path d="M3 18h18" />
                </svg>
              )}
            </button>
            <NavLink to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="h-9 w-9 rounded bg-blue-600 flex items-center justify-center font-bold text-white tracking-tight group-hover:bg-blue-700 transition-colors">
                L
              </div>
              <span className="hidden md:inline font-semibold text-lg text-blue-700 group-hover:text-blue-800 select-none">
                LSSCTC
              </span>
            </NavLink>
          </div>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center justify-center  flex-1">
            <ul className="flex pt-4 gap-1">
              <li>
                <NavLink to="/" className={getLinkClass}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/program" className={getLinkClass}>
                  Programs
                </NavLink>
              </li>
              <li>
                <NavLink to="/course" className={getLinkClass}>
                  Courses
                </NavLink>
              </li>
              <li>
                <NavLink to="/simulator" className={getLinkClass}>
                  Simulator
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={getLinkClass}>
                  About
                </NavLink>
              </li>
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            {hasToken ? (
              <Avt onLogout={() => { Cookies.remove('token', { path: '/' }); try{clearRememberedCredentials();}catch{} setHasToken(false); }} />
            ) : (
              <a
                href="auth/login"
                className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow-sm transition-colors"
              >
                Sign in
              </a>
            )}
          </div>

          {/* Mobile panel */}
          <div
            className={[
              "md:hidden absolute top-full left-0 right-0 origin-top overflow-hidden border border-t border-gray-200 bg-white shadow-sm",
              "transition-all duration-200",
              mobileOpen
                ? "opacity-100 pointer-events-auto translate-y-0"
                : "opacity-0 pointer-events-none -translate-y-2",
            ].join(" ")}
          >
            <div className="flex flex-wrap justify-center gap-2 px-3 py-3">
              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/courses"
                className={getLinkClass}
              >
                Courses
              </NavLink>
              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/simulator"
                className={getLinkClass}
              >
                Simulator
              </NavLink>
              <NavLink
                onClick={() => setMobileOpen(false)}
                to="/about"
                className={getLinkClass}
              >
                About
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
