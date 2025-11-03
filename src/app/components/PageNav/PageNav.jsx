import React from 'react';
import { Skeleton } from 'antd';
import { Link, useLocation } from 'react-router';
import { Home } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../ui/breadcrumb';

function toTitle(seg) {
  if (!seg) return '';
  return seg.replace(/[-_]/g, ' ').replace(/\b\w/g, (s) => s.toUpperCase());
}

export default function PageNav({ items, className = '', rootHref = '/', rootLabel = 'Home', hideIds = true }) {
  const location = useLocation();

  const builtItems = React.useMemo(() => {
    if (Array.isArray(items) && items.length) {
      return [
        { key: 'root', href: rootHref, title: rootLabel, isRoot: true },
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
      { key: 'root', href: rootHref, title: rootLabel, isRoot: true },
      ...pathnames.map((seg, idx) => {
        const url = '/' + pathnames.slice(0, idx + 1).join('/');
        const isLast = idx === pathnames.length - 1;
        const looksLikeId = /^(\d+|[0-9a-fA-F-]{6,})$/.test(seg);

        if (hideIds && looksLikeId) {
          return {
            key: url,
            href: isLast ? null : url,
            title: 'Detail',
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
  }, [items, location.pathname, rootHref, rootLabel, hideIds]);

  if (!builtItems) return <Skeleton active />;

  return (
    <div className={['py-2', className].join(' ').trim()}>
      <Breadcrumb>
        <BreadcrumbList>
          {builtItems.map((item, idx) => (
            <React.Fragment key={item.key}>
              <BreadcrumbItem>
                {item.isLast ? (
                  <BreadcrumbPage>{item.title}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      to={item.href}
                      className="inline-flex items-center gap-1.5"
                      title={item.title}
                    >
                      {item.isRoot && <Home className="w-4 h-4" />}
                      <span className="text-sm font-medium text-gray-700">{item.title}</span>
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {idx < builtItems.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
