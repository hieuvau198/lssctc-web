import React from 'react';
import { useNavigate } from 'react-router';
import slugify from '../../lib/slugify';

export default function SlugLink({ name, basePath, className = '', onClick, children }) {
  const navigate = useNavigate();
  const handleClick = (e) => {
    if (onClick) onClick(e);
    if (e?.defaultPrevented) return;
    const slug = slugify(name);
    navigate(`${basePath}/${slug}`);
  };

  return (
    <span role="link" tabIndex={0} className={className} onClick={handleClick} onKeyDown={(e)=>{ if(e.key==='Enter'||e.key===' ') handleClick(e); }}>
      {children}
    </span>
  );
}
