import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import ScrollTop from '../../components/ScrollTop/ScrollTop';
import { Alert, Skeleton } from 'antd';
import { PlayCircle, BookOpen, Users, CheckCircle2 } from 'lucide-react';

export default function SessionLayout({
  itemsLoading = false,
  items = [], // [{id, type:'video'|'reading'|'quiz', title, duration, completed}]
  onSelectItem,
  error,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, sessionId } = useParams();

  const activeId = React.useMemo(() => {
    const segs = location.pathname.split('/').filter(Boolean);
    return segs[segs.length - 1];
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-slate-50/60 flex flex-col overflow-y-auto">
          <div className="px-4 py-4 border-b">
            <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">Module Content</h2>
          </div>
          <div className="flex-1 overflow-y-auto pb-6">
            {error && (
              <div className="p-4">
                <Alert type="error" showIcon message={error} />
              </div>
            )}
            {itemsLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton.Button key={i} active block size="small" style={{ height: 32 }} />
                ))}
              </div>
            ) : (
              <ul className="p-2 space-y-1">
                {items.map((it) => {
                  const active = it.id === activeId;
                  return (
                    <li key={it.id}>
                      <button
                        type="button"
                        onClick={() => onSelectItem ? onSelectItem(it) : navigate(it.href || `./${it.id}`)}
                        className={[
                          'w-full text-left px-3 py-2 rounded-md text-sm flex items-center gap-2 transition',
                          active
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'hover:bg-slate-100 text-slate-700'
                        ].join(' ')}
                      >
                        <IconFor type={it.type} completed={it.completed} />
                        <span className="flex-1 truncate">{it.title}</span>
                        {it.duration && (
                          <span className="text-[11px] font-medium opacity-70">
                            {it.duration}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
                {items.length === 0 && !error && (
                  <li className="px-3 py-6 text-xs text-slate-500">No session items</li>
                )}
              </ul>
            )}
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[980px] px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
      <ScrollTop />
    </div>
  );
}

function IconFor({ type, completed }) {
  const base = 'w-4 h-4 flex-shrink-0';
  if (completed) return <CheckCircle2 className={`${base} text-green-500`} />;
  switch (type) {
    case 'reading':
      return <BookOpen className={`${base} text-sky-600`} />;
    case 'quiz':
      return <PlayCircle className={`${base} text-amber-600`} />;
    case 'video':
      return <PlayCircle className={`${base} text-blue-600`} />;
    default:
      return <BookOpen className={`${base} text-slate-400`} />;
  }
}
