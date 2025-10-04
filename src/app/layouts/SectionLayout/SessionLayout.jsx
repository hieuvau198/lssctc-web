import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import ScrollTop from '../../components/ScrollTop/ScrollTop';
import { Alert, Skeleton, Menu } from 'antd';
import { PlayCircle, BookOpen, Users, CheckCircle2 } from 'lucide-react';
import './SessionLayout.css';

export default function SectionLayout({
  itemsLoading = false,
  items = [], // [{id, type:'video'|'reading'|'quiz', title, duration, completed}]
  onSelectItem,
  error
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, sessionId } = useParams();

  const activeId = React.useMemo(() => {
    const segs = location.pathname.split('/').filter(Boolean);
    return segs[segs.length - 1];
  }, [location.pathname]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-72 border-r border-slate-200 bg-slate-50/60 flex flex-col">
          <div className="px-4 py-4 border-b">
            <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase">Module Content</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {error && (
              <div className="p-4">
                <Alert type="error" showIcon message={error} />
              </div>
            )}
            {itemsLoading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton.Button active block size="large" style={{ height: 40 }} />
                    <div className="ml-4 space-y-1">
                      <Skeleton.Button active block size="small" style={{ height: 32 }} />
                      <Skeleton.Button active block size="small" style={{ height: 32 }} />
                      <Skeleton.Button active block size="small" style={{ height: 32 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <SidebarMenu items={items} activeId={activeId} navigate={navigate} onSelectItem={onSelectItem} />
            )}
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="mx-auto w-full max-w-[980px] px-6 py-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
      <ScrollTop />
    </div>
  );
}

// Separate component for sidebar menu
function SidebarMenu({ items, activeId, navigate, onSelectItem }) {
  // Group items by sections
  const menuItems = React.useMemo(() => {
    const groups = {};
    const menuData = [];

    items.forEach(item => {
      if (item.isHeader) {
        groups[item.id] = {
          section: item,
          partitions: []
        };
      } else if (item.sectionId && groups[item.sectionId]) {
        groups[item.sectionId].partitions.push(item);
      }
    });

    // Convert to Antd Menu format
    Object.values(groups).forEach(group => {
      menuData.push({
        key: group.section.id,
        icon: <IconFor type="section" completed={group.section.completed} />,
        label: group.section.title,
        children: group.partitions.map(partition => ({
          key: partition.id,
          icon: <IconFor type={partition.type} completed={partition.completed} />,
          label: (
            <div className="flex items-center justify-between w-full">
              <span className="truncate">{partition.title}</span>
              {partition.duration && (
                <span className="text-[11px] font-medium opacity-70 ml-2">
                  {partition.duration}
                </span>
              )}
            </div>
          ),
          onClick: () => {
            if (onSelectItem) {
              onSelectItem(partition);
            } else {
              navigate(partition.href || `./${partition.id}`);
            }
          }
        }))
      });
    });

    return menuData;
  }, [items, navigate, onSelectItem]);

  const handleMenuClick = (info) => {
    const item = items.find(it => it.id === info.key);
    if (item && !item.isHeader) {
      if (onSelectItem) {
        onSelectItem(item);
      } else {
        navigate(item.href || `./${item.id}`);
      }
    }
  };

  return (
    <div className="p-2">
      <Menu
        mode="inline"
        selectedKeys={[activeId]}
        defaultOpenKeys={menuItems.map(item => item.key)}
        onClick={handleMenuClick}
        items={menuItems}
        className="session-sidebar-menu"
        theme="light"
      />
      {items.length === 0 && (
        <div className="px-3 py-6 text-xs text-slate-500 text-center">
          No session items
        </div>
      )}
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
    case 'section':
      return <Users className={`${base} text-slate-600`} />;
    default:
      return <BookOpen className={`${base} text-slate-400`} />;
  }
}
