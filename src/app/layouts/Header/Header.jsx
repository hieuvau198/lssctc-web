import React, { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router';

export default function Header() {
  const [hidden, setHidden] = useState(false);
  const [atTop, setAtTop] = useState(true);
  const lastScroll = useRef(0);

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
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkBase = 'px-3 py-2 text-sm font-medium transition-colors';
  const getLinkClass = ({ isActive }) => [
    linkBase,
    isActive ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'
  ].join(' ');

  return (
    <header
      className={[
        'fixed top-0 left-0 right-0 z-50 backdrop-blur',
        'transition-transform duration-300 border-b border-b-gray-300',
        atTop ? 'bg-white/90' : 'bg-white shadow-sm',
        hidden ? '-translate-y-full' : 'translate-y-0'
      ].join(' ')}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 shrink-0 group">
              <div className="h-9 w-9 rounded bg-blue-600 flex items-center justify-center font-bold text-white tracking-tight group-hover:bg-blue-700 transition-colors">L</div>
              <span className="font-semibold text-lg text-blue-700 group-hover:text-blue-800 select-none">LSSCTC</span>
            </NavLink>

          {/* Center Nav */}
          <nav className="hidden md:flex items-center justify-center flex-1">
            <ul className="flex items-center gap-1">
              <li><NavLink to="/courses" className={getLinkClass}>Courses</NavLink></li>
              <li><NavLink to="/schedule" className={getLinkClass}>Schedule</NavLink></li>
              <li><NavLink to="/simulator" className={getLinkClass}>Simulator</NavLink></li>
              <li><NavLink to="/assessments" className={getLinkClass}>Assessments</NavLink></li>
              <li><NavLink to="/about" className={getLinkClass}>About</NavLink></li>
            </ul>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <NavLink to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">Sign in</NavLink>
            <NavLink
              to="/register"
              className="inline-flex items-center rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 shadow-sm transition-colors"
            >
              Sign up
            </NavLink>
          </div>
        </div>
      </div>
    </header>
  );
}
