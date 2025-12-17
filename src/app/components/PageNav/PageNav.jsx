import React from 'react';
import { Skeleton } from 'antd';
import { Link, useLocation } from 'react-router';
import { Home, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';

function toTitle(seg) {
  if (!seg) return '';
  return seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
}

export default function PageNav({ items, className = '', rootHref = '/', rootLabel, hideIds = true }) {
  const location = useLocation();
  const { t } = useTranslation();
  const homeLabel = rootLabel || t('common.home');

  const builtItems = React.useMemo(() => {
    if (Array.isArray(items) && items.length) {
      return [
        { key: 'root', href: rootHref, title: homeLabel, isRoot: true },
        ...items.map((it, idx) => ({
          key: it.href || `i-${idx}`,
          href: it.href,
          title: it.title,
          isLast: idx === items.length - 1,
        })),
      ];
    }

    const pathnames = location.pathname.split('/').filter(Boolean);
    const built = [
      { key: 'root', href: rootHref, title: homeLabel, isRoot: true },
      ...pathnames.map((seg, idx) => {
        const url = '/' + pathnames.slice(0, idx + 1).join('/');
        const isLast = idx === pathnames.length - 1;
        const looksLikeId = /^(\d+|[0-9a-fA-F-]{6,})$/.test(seg);

        if (hideIds && looksLikeId) {
          return {
            key: url,
            href: isLast ? null : url,
            title: t('common.detail'),
            isLast,
          };
        }

        return {
          key: url,
          href: isLast ? null : url,
          title: toTitle(seg),
          isLast,
        };
      }),
    ];
    return built;
  }, [items, location.pathname, rootHref, homeLabel, hideIds, t]);

  if (!builtItems) return <Skeleton active />;

  return (
    <nav className={['py-2', className].join(' ').trim()} aria-label="Breadcrumb">
      <ol className="flex items-center gap-1 flex-wrap">
        {builtItems.map((item, idx) => (
          <React.Fragment key={item.key}>
            <li className="flex items-center">
              {item.isLast ? (
                <span className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  {item.title}
                </span>
              ) : (
                <Link
                  to={item.href}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-neutral-500 hover:text-yellow-600 transition-colors"
                >
                  {item.isRoot && <Home className="w-4 h-4" />}
                  <span>{item.title}</span>
                </Link>
              )}
            </li>
            {idx < builtItems.length - 1 && (
              <li className="flex items-center text-neutral-300" aria-hidden>
                <ChevronRight className="w-4 h-4" />
              </li>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
