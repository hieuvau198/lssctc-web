import React from 'react';
import { Breadcrumb, Skeleton, Tooltip } from 'antd';
import { Link, useLocation } from 'react-router';
import { Home } from 'lucide-react';

/**
 * PageNav: Lightweight breadcrumb/navigation for page headers.
 * - Auto builds items from current URL if `items` not provided.
 * - Include Skeleton per project guideline.
 */
export default function PageNav({
  items,
  loading = false,
  rootLabel = 'Home',
  rootHref = '/',
  nameMap = {},
  hideIds = true,
  className = '',
}) {
  const location = useLocation();

  if (loading) {
    return (
      <div className={['py-2', className].join(' ').trim()}>
        <Skeleton.Button active size="small" style={{ width: 240 }} />
      </div>
    );
  }

  const toTitle = (seg) => {
    if (nameMap && nameMap[seg]) return nameMap[seg];
    return seg
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(' ');
  };

  const rootCrumb = (
    <Link
      to={rootHref}
      className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 leading-none align-middle"
      aria-label={rootLabel || 'Home'}
      style={{ lineHeight: '1.25rem' }}
    >
      <Tooltip title={rootLabel || 'Home'} placement="top">
        <span className="inline-flex items-center justify-center h-5">
          <Home className="w-4 h-4 align-middle" />
        </span>
      </Tooltip>
      <span className="sr-only">{rootLabel || 'Home'}</span>
    </Link>
  );

  const builtItems = React.useMemo(() => {
    if (Array.isArray(items) && items.length) {
      return [
        { key: 'root', title: rootCrumb },
        ...items.map((it, idx) => ({
          key: it.href || `i-${idx}`,
          title: it.href ? <Link to={it.href}>{it.title}</Link> : <span className="text-slate-700">{it.title}</span>,
        })),
      ];
    }

    const pathnames = location.pathname.split('/').filter(Boolean);
    const built = [
      { key: 'root', title: rootCrumb },
      ...pathnames.map((seg, idx) => {
        const url = '/' + pathnames.slice(0, idx + 1).join('/');
        const isLast = idx === pathnames.length - 1;
        const looksLikeId = /^(\d+|[0-9a-fA-F-]{6,})$/.test(seg);
        if (hideIds && looksLikeId) {
          return {
            key: url,
            title: isLast ? <span className="text-slate-700">Detail</span> : <Link to={url}>Detail</Link>,
          };
        }
        return {
          key: url,
          title: isLast ? (
            <span className="text-slate-700">{toTitle(seg)}</span>
          ) : (
            <Link to={url}>{toTitle(seg)}</Link>
          ),
        };
      }),
    ];
    return built;
  }, [items, location.pathname, rootHref, rootLabel, hideIds, nameMap, rootCrumb]);

  return (
    <div className={["py-2", className].join(' ').trim()}>
      <Breadcrumb items={builtItems} />
    </div>
  );
}
