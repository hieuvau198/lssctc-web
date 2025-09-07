import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function ScrollTop({ threshold = 240, containerSelector, bottom = 24, right = 24 }) {
  const [visible, setVisible] = useState(false);
  const ticking = useRef(false);
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current = containerSelector ? document.querySelector(containerSelector) : null;
  }, [containerSelector]);

  const getContext = () => {
    const el = containerRef.current;
    if (el) return { top: el.scrollTop, scrollTo: (opts) => el.scrollTo(opts), target: el };
    return { top: window.scrollY, scrollTo: (opts) => window.scrollTo(opts), target: window };
  };

  const onScroll = useCallback(() => {
    if (ticking.current) return;
    ticking.current = true;
    requestAnimationFrame(() => {
      const { top } = getContext();
      setVisible(top > threshold);
      ticking.current = false;
    });
  }, [threshold]);

  useEffect(() => {
    const { target } = getContext();
    target.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => target.removeEventListener('scroll', onScroll);
  }, [onScroll, containerSelector]);

  const scrollToTop = useCallback(() => {
    const prefersReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const { scrollTo } = getContext();
    scrollTo({ top: 0, behavior: prefersReduce ? 'auto' : 'smooth' });
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={scrollToTop}
      style={{ bottom, right }}
      className="fixed z-40 h-12 w-12 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-600/30 flex items-center justify-center hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="h-6 w-6 pointer-events-none transition-transform group-hover:-translate-y-0.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M5 12l7-7 7 7" />
        <path d="M12 19V5" />
      </svg>
    </button>
  );
}
