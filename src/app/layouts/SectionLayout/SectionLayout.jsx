import React from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import ScrollTop from '../../components/ScrollTop/ScrollTop';
import { Alert, Skeleton, Tooltip } from 'antd';
import { CheckCircle2 } from 'lucide-react';
import './SectionLayout.css';

export default function SectionLayout({
  itemsLoading = false,
  items = [], // [{id, type:'video'|'reading'|'quiz', title, duration, completed}]
  onSelectItem,
  error,
  courseTitle = "Module Content" // Default fallback
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
            <Tooltip title={courseTitle} placement="topLeft">
              <h2 className="text-sm font-semibold tracking-wide text-slate-700 uppercase truncate">
                {courseTitle}
              </h2>
            </Tooltip>
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
  const [expandedSections, setExpandedSections] = React.useState({});
  
  // Group items by sections
  const sections = React.useMemo(() => {
    const groups = {};
    
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
    
    return Object.values(groups);
  }, [items]);

  // Initialize all sections as expanded by default
  React.useEffect(() => {
    const initialExpanded = {};
    sections.forEach(group => {
      initialExpanded[group.section.id] = true;
    });
    setExpandedSections(initialExpanded);
  }, [sections]);

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleItemClick = (item) => {
    if (item.isHeader) return; // Don't navigate on section headers

    // Optional callback
    if (onSelectItem) onSelectItem(item);

    // Always navigate to keep URL in sync
    const target = item.href 
      || (item.sectionId ? `/learn/${courseId}/${item.sectionId}/${item.id}` : `/learn/${courseId}/${item.id}`);
    navigate(target);
  };

  return (
    <div className="p-3">
      {sections.map((group) => {
        const isExpanded = expandedSections[group.section.id];
        
        return (
          <div key={group.section.id} className="mb-4">
            {/* Section Header - Clickable to expand/collapse */}
            <button
              type="button"
              onClick={() => toggleSection(group.section.id)}
              className="w-full flex items-center justify-between px-3 py-3 text-left hover:bg-blue-300 rounded-lg transition-colors duration-200 group cursor-pointer"
            >
              <h3 className="text-base font-bold text-slate-900 group-hover:text-black">
                {group.section.title}
              </h3>
              
              {/* Expand/Collapse Icon */}
              <div className={[
                'transition-transform duration-200 group-hover:text-black',
                isExpanded ? 'rotate-90' : 'rotate-0'
              ].join(' ')}>
                <svg className="w-5 h-5 text-slate-500 group-hover:text-black " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
            
            {/* Section Partitions - Collapsible */}
            {isExpanded && (
              <div className="mt-2 space-y-1">
                {group.partitions.map((partition) => {
                  const isActive = partition.id === activeId;
                  
                  return (
                    <div className="relative">
                      {/* Active State Indicator Bar */}
                      {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
                      )}
                      
                      <button
                        key={partition.id}
                        type="button"
                        onClick={() => handleItemClick(partition)}
                        className={[
                          'w-full text-left px-3 py-3 rounded-none transition-all duration-200 flex items-start gap-3 group cursor-pointer',
                          isActive
                            ? 'bg-blue-50 border border-blue-200'
                            : 'hover:bg-blue-100 border border-transparent hover:border-blue-200'
                        ].join(' ')}
                      >
                      {/* Completion Status Circle */}
                      <div className="flex-shrink-0 mt-0.5">
                        {partition.completed ? (
                          <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="mb-1">
                          <Tooltip title={partition.title} placement="topLeft">
                            <h4 className={[
                              'text-sm font-medium truncate group-hover:text-blue-700',
                              isActive ? 'text-blue-700' : 'text-slate-900'
                            ].join(' ')}>
                              {partition.title}
                            </h4>
                          </Tooltip>
                        </div>
                        
                        {/* Subtitle with duration and type */}
                        <div className="flex items-center gap-2 text-xs text-slate-500 group-hover:text-blue-600">
                          <span className="capitalize">{partition.type}</span>
                          {partition.duration && (
                            <>
                              <span>•</span>
                              <span>{partition.duration}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
      
      {items.length === 0 && (
        <div className="px-3 py-6 text-xs text-slate-500 text-center">
          No session items
        </div>
      )}
    </div>
  );
}
