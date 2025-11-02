import React from 'react';

export function Breadcrumb({ children, className = '' }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      {children}
    </nav>
  );
}

export function BreadcrumbList({ children, className = 'flex items-center space-x-2' }) {
  return (
    <ol className={className}>
      {children}
    </ol>
  );
}

export function BreadcrumbItem({ children, className = 'inline-flex items-center' }) {
  return <li className={className}>{children}</li>;
}

// BreadcrumbLink supports `asChild` pattern: when asChild is true we render children directly
export function BreadcrumbLink({ children, asChild = false, className = '', ...props }) {
  if (asChild) {
    return <>{children}</>;
  }
  return (
    <a {...props} className={className}>
      {children}
    </a>
  );
}

export function BreadcrumbPage({ children, className = 'text-sm font-medium text-slate-700' }) {
  return <span className={className}>{children}</span>;
}

export function BreadcrumbSeparator({ className = 'mx-2 text-slate-400' }) {
  return (
    <span className={className} aria-hidden>
      {/* simple chevron */}
      <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </span>
  );
}

export default Breadcrumb;
