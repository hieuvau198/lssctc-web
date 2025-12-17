import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronUp } from 'lucide-react';

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
      className="fixed z-40 h-12 w-12 bg-yellow-400 text-black border-2 border-black flex items-center justify-center hover:text-yellow-400 focus:outline-none transition-all group"
    >
      <ChevronUp className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" />
    </button>
  );
}
