// src\app\layouts\SectionLayout\SectionLayout.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ScrollTop from '../../components/ScrollTop/ScrollTop';
import { Alert, Skeleton, Tooltip, Button, Progress, Modal } from 'antd';
import { CheckCircle2, ArrowLeft, GraduationCap, Trophy, PartyPopper, Star, GripVertical } from 'lucide-react';
import { useLearningSidebar } from '../../contexts/LearningSidebarContext';
import './SectionLayout.css';

export default function SectionLayout({
  itemsLoading = false,
  items = [],
  onSelectItem,
  error,
  courseTitle = "Course Title",
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { courseId, sessionId } = useParams();
  const classId = courseId;

  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem('learningSidebarWidth');
    return saved ? parseInt(saved, 10) : 320;
  });
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);
  const minWidth = 280;
  const maxWidth = 500;

  // Handle resize
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      localStorage.setItem('learningSidebarWidth', sidebarWidth.toString());
    }
  }, [isResizing, sidebarWidth]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  // Get completion modal state from context
  const { showCompletionModal, courseTitle: completedCourseTitle, closeCompletionModal } = useLearningSidebar();

  const activeId = React.useMemo(() => {
    const segs = location.pathname.split('/').filter(Boolean);
    return segs[segs.length - 1];
  }, [location.pathname]);

  // Calculate overall progress
  const progress = React.useMemo(() => {
    const activities = items.filter(item => !item.isHeader);
    if (activities.length === 0) return 0;
    const completed = activities.filter(item => item.isCompleted).length;
    return Math.round((completed / activities.length) * 100);
  }, [items]);

  const totalActivities = items.filter(item => !item.isHeader).length;
  const completedActivities = items.filter(item => !item.isHeader && item.isCompleted).length;

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Course Completion Celebration Modal */}
      <Modal
        open={showCompletionModal}
        onCancel={closeCompletionModal}
        footer={null}
        centered
        width={480}
        className="completion-modal"
      >
        <div className="text-center py-6">
          {/* Celebration Icon */}
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center mx-auto shadow-xl shadow-green-200 animate-bounce">
              <Trophy className="w-12 h-12 text-white" />
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg animate-pulse">
              <Star className="w-5 h-5 text-white" fill="white" />
            </div>
            <div className="absolute -bottom-1 -left-3 w-7 h-7 rounded-full bg-pink-400 flex items-center justify-center shadow-lg animate-pulse delay-100">
              <PartyPopper className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            🎉 {t('sectionLayout.congratulations')} 🎉
          </h2>
          <p className="text-lg text-slate-600 mb-4">
            {t('sectionLayout.youHaveCompleted')}
          </p>
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 mb-6 border border-cyan-100">
            <h3 className="text-xl font-bold text-cyan-700">
              {completedCourseTitle || courseTitle}
            </h3>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
            <CheckCircle2 className="w-6 h-6" />
            <span className="text-lg font-semibold">100% {t('sectionLayout.complete')}</span>
          </div>

          {/* Message */}
          <p className="text-slate-500 mb-6">
            {t('sectionLayout.greatJob')}
          </p>

          {/* Actions */}
          <div className="flex gap-3 justify-center">
            <Button
              size="large"
              onClick={() => {
                closeCompletionModal();
                navigate(`/my-classes/${classId}`);
              }}
            >
              {t('sectionLayout.backToClass')}
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={closeCompletionModal}
              className="shadow-lg shadow-cyan-200"
            >
              {t('sectionLayout.continueLearning')}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          ref={sidebarRef}
          style={{ width: sidebarWidth }}
          className="border-r border-slate-200/60 bg-white/90 backdrop-blur-sm flex flex-col shadow-lg shadow-slate-200/50 relative"
        >
          {/* Header Section */}
          <div className="px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-cyan-500 to-blue-500 relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute top-1/2 right-0 w-32 h-32 -translate-y-1/2 rounded-full bg-white/5 blur-xl" />
            </div>

            <div className="relative flex items-center gap-2 mb-3">
              <Button
                type="text"
                shape="circle"
                size="small"
                aria-label={t('sectionLayout.backToClassAriaLabel')}
                onClick={() => navigate(`/my-classes/${classId}`)}
                icon={<ArrowLeft color="white" className="w-5 h-5" />}
                className="hover:bg-white/20 border-white/30 flex-shrink-0 mt-0.5"
              />
              <div className="flex flex-1 items-center gap-2 min-w-0">
                <div className="flex-shrink-0">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-sm font-semibold text-white leading-tight block break-words">
                    {courseTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative space-y-2">
              <div className="flex items-center justify-between text-xs text-white/90">
                <span className="font-medium">{t('sectionLayout.yourProgress')}</span>
                <span className="font-semibold">{completedActivities}/{totalActivities} {t('sectionLayout.activities')}</span>
              </div>
              <Progress
                percent={progress}
                strokeColor={{ from: '#fff', to: 'rgba(255,255,255,0.8)' }}
                trailColor="rgba(255,255,255,0.3)"
                size="small"
                showInfo={false}
              />
              <div className="text-right text-xs font-semibold text-white">
                {progress}% {t('sectionLayout.complete')}
              </div>
            </div>
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
              <SidebarMenu items={items} activeId={activeId} navigate={navigate} onSelectItem={onSelectItem} t={t} />
            )}
          </div>

          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className={`absolute top-0 right-0 w-1 h-full cursor-col-resize group hover:bg-cyan-400 transition-colors ${isResizing ? 'bg-cyan-500' : 'bg-transparent'}`}
          >
            <div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-8 rounded bg-slate-300 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <GripVertical className="w-3 h-3 text-slate-500" />
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="flex-1 overflow-hidden bg-gradient-to-br from-white to-slate-50/50">
          <div className="h-full overflow-y-auto">
            <div className="mx-auto w-full max-w-[1200px] px-8 py-8">
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
function SidebarMenu({ items, activeId, navigate, onSelectItem, t }) {
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

  const handlePartitionClick = (partition) => {
    if (partition.isHeader) return; // Don't navigate on section headers

    // Optional callback
    if (onSelectItem) onSelectItem(partition);

    // Always navigate to keep URL in sync
    const target =
      partition.href ||
      (partition.sectionId
        ? `/learnings/${classId}/${partition.sectionId}/${partition.id}`
        : `/learnings/${classId}/${partition.id}`);

    navigate(target);
  };


  return (
    <div className="p-3">
      {sections.map((group) => {
        const isExpanded = expandedSections[group.section.id];

        return (
          <div key={group.section.id} className="mb-3">
            {/* Section Header - Clickable to expand/collapse */}
            <button
              type="button"
              onClick={() => toggleSection(group.section.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left bg-gradient-to-r from-slate-50 to-white hover:from-cyan-50 hover:to-blue-50 rounded-xl transition-all duration-200 group cursor-pointer border border-slate-200 hover:border-cyan-300 shadow-sm hover:shadow"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={[
                  'w-8 h-8 rounded-lg flex items-center justify-center transition-colors',
                  group.section.isCompleted
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white border-2 border-slate-300 text-slate-500'
                ].join(' ')}>
                  {group.section.isCompleted ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <span className="text-xs font-bold">{group.partitions.filter(p => p.isCompleted).length}/{group.partitions.length}</span>
                  )}
                </div>
                <span className="text-sm font-semibold text-slate-900 group-hover:text-cyan-700 truncate">
                  {group.section.title}
                </span>
              </div>

              {/* Expand/Collapse Icon */}
              <div className={[
                'transition-transform duration-300 flex-shrink-0',
                isExpanded ? 'rotate-90' : 'rotate-0'
              ].join(' ')}>
                <svg className="w-5 h-5 text-slate-400 group-hover:text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* Section Partitions - Collapsible */}
            {isExpanded && (
              <div className="mt-2 ml-3 space-y-1.5 border-l-2 border-slate-200 pl-3">
                {group.partitions.map((partition) => {
                  // Fix: Convert both to string for comparison
                  const isActive = String(partition.id) === String(activeId);

                  // Get icon based on activity type
                  const getActivityIcon = () => {
                    const iconClass = "w-4 h-4";
                    switch (partition.type?.toLowerCase()) {
                      case 'material':
                        return (
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                        );
                      case 'quiz':
                        return (
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        );
                      case 'practice':
                        return (
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                          </svg>
                        );
                      default:
                        return (
                          <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        );
                    }
                  };

                  return (
                    <div key={partition.id} className="relative group/item">
                      {/* Active State Indicator */}
                      {isActive && (
                        <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-blue-600 rounded-full"></div>
                      )}

                      <button
                        type="button"
                        onClick={() => handlePartitionClick(partition)}
                        className={[
                          'w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-3 cursor-pointer',
                          isActive
                            ? 'bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 shadow-sm'
                            : 'hover:bg-slate-50 border border-transparent hover:border-slate-200 hover:shadow-sm'
                        ].join(' ')}
                      >
                        {/* Completion Status */}
                        <div className="flex-shrink-0">
                          {partition.isCompleted ? (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm ring-2 ring-emerald-200">
                              <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                            </div>
                          ) : isActive ? (
                            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-sm ring-2 ring-cyan-200 animate-pulse">
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            </div>
                          ) : (
                            <div className={[
                              'w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors',
                              'border-slate-300 bg-white group-hover/item:border-cyan-300 group-hover/item:bg-cyan-50'
                            ].join(' ')}>
                              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover/item:bg-cyan-400"></div>
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <Tooltip title={partition.title} placement="right">
                            <span className={[
                              'text-sm font-medium truncate block leading-5',
                              isActive
                                ? 'text-cyan-700 font-semibold'
                                : 'text-slate-700 group-hover/item:text-cyan-600'
                            ].join(' ')}>
                              {partition.title}
                            </span>
                          </Tooltip>
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
          {t('sectionLayout.noSessionItems')}
        </div>
      )}
    </div>
  );
}
