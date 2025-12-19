// src\app\layouts\SectionLayout\SectionLayout.jsx
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import ScrollTop from '../../components/ScrollTop/ScrollTop';
import { Alert, Skeleton, Tooltip, Button, Modal } from 'antd';
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
    const { courseId } = useParams();
    const classId = courseId;

    const [sidebarWidth, setSidebarWidth] = useState(() => {
        const saved = localStorage.getItem('learningSidebarWidth');
        return saved ? parseInt(saved, 10) : 320;
    });
    const [isResizing, setIsResizing] = useState(false);
    const sidebarRef = useRef(null);

    const handleMouseDown = useCallback((e) => { e.preventDefault(); setIsResizing(true); }, []);
    const handleMouseMove = useCallback((e) => {
        if (!isResizing) return;
        const newWidth = e.clientX;
        if (newWidth >= 280 && newWidth <= 500) setSidebarWidth(newWidth);
    }, [isResizing]);
    const handleMouseUp = useCallback(() => {
        if (isResizing) { setIsResizing(false); localStorage.setItem('learningSidebarWidth', sidebarWidth.toString()); }
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
        return () => { document.removeEventListener('mousemove', handleMouseMove); document.removeEventListener('mouseup', handleMouseUp); };
    }, [isResizing, handleMouseMove, handleMouseUp]);

    const { showCompletionModal, courseTitle: completedCourseTitle, closeCompletionModal } = useLearningSidebar();
    const activeId = React.useMemo(() => location.pathname.split('/').filter(Boolean).pop(), [location.pathname]);
    const progress = React.useMemo(() => {
        const activities = items.filter(item => !item.isHeader);
        if (activities.length === 0) return 0;
        return Math.round((activities.filter(item => item.isCompleted).length / activities.length) * 100);
    }, [items]);

    const totalActivities = items.filter(item => !item.isHeader).length;
    const completedActivities = items.filter(item => !item.isHeader && item.isCompleted).length;

    return (
        <div className="h-screen flex flex-col bg-neutral-100">
            <Modal open={showCompletionModal} onCancel={closeCompletionModal} footer={null} centered width={480} className="completion-modal">
                <div className="text-center py-6">
                    <div className="relative inline-block mb-6">
                        <div className="w-24 h-24 border-4 border-black bg-yellow-400 flex items-center justify-center mx-auto"><Trophy className="w-12 h-12 text-black" /></div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-black flex items-center justify-center"><Star className="w-5 h-5 text-yellow-400" fill="currentColor" /></div>
                    </div>
                    <h2 className="text-2xl font-black text-black uppercase mb-2">🎉 {t('sectionLayout.congratulations')} 🎉</h2>
                    <p className="text-lg text-neutral-600 mb-4">{t('sectionLayout.youHaveCompleted')}</p>
                    <div className="bg-yellow-50 border-2 border-black p-4 mb-6"><h3 className="text-xl font-black text-black uppercase">{completedCourseTitle || courseTitle}</h3></div>
                    <div className="flex items-center justify-center gap-2 text-black mb-6"><CheckCircle2 className="w-6 h-6" /><span className="text-lg font-black uppercase">100% {t('sectionLayout.complete')}</span></div>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => { closeCompletionModal(); navigate(`/my-classes/${classId}`); }} className="px-6 py-3 bg-white text-black font-bold uppercase border-2 border-black hover:bg-neutral-100">{t('sectionLayout.backToClass')}</button>
                        <button onClick={closeCompletionModal} className="px-6 py-3 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:scale-[1.02]">{t('sectionLayout.continueLearning')}</button>
                    </div>
                </div>
            </Modal>

            <div className="flex flex-1 overflow-hidden">
                <aside ref={sidebarRef} style={{ width: sidebarWidth }} className="border-r-2 border-black bg-white flex flex-col relative">
                    <div className="px-5 py-4 border-b-2 border-black bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 relative">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-black" />
                        <div className="flex items-center gap-2 mb-3 pt-1">
                            <button onClick={() => navigate(`/my-classes/${classId}`)} className="w-8 h-8 border-2 border-black flex items-center justify-center text-black bg-white/80 hover:bg-yellow-500 hover:scale-105 transition-all"><ArrowLeft className="w-4 h-4" /></button>
                            <GraduationCap className="w-5 h-5 text-black" />
                            <span className="text-sm font-bold text-black uppercase tracking-wide truncate">{courseTitle}</span>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-xs text-black/70"><span className="font-bold uppercase">{t('sectionLayout.yourProgress')}</span><span className="font-bold text-black">{completedActivities}/{totalActivities}</span></div>
                            <div className="w-full h-2 border-2 border-black bg-white/50"><div className="h-full bg-black transition-all" style={{ width: `${progress}%` }} /></div>
                            <div className="text-right text-xs font-bold text-black uppercase">{progress}% {t('sectionLayout.complete')}</div>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {error && <div className="p-4"><Alert type="error" showIcon message={error} /></div>}
                        {itemsLoading ? <div className="space-y-3 p-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton.Button key={i} active block size="large" style={{ height: 40 }} />)}</div>
                            : <SidebarMenu items={items} activeId={activeId} navigate={navigate} onSelectItem={onSelectItem} t={t} classId={classId} />}
                    </div>
                    <div onMouseDown={handleMouseDown} className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-yellow-400 transition-colors ${isResizing ? 'bg-yellow-500' : ''}`}><div className="absolute top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-4 h-8 bg-neutral-300 opacity-0 hover:opacity-100 flex items-center justify-center"><GripVertical className="w-3 h-3" /></div></div>
                </aside>
                <main className="flex-1 overflow-hidden bg-neutral-50"><div className="h-full overflow-y-auto"><div className="mx-auto w-full max-w-[1200px] px-8 py-8"><Outlet /></div></div></main>
            </div>
            <ScrollTop />
        </div>
    );
}

function SidebarMenu({ items, activeId, navigate, onSelectItem, t, classId }) {
    const [expandedSections, setExpandedSections] = React.useState({});
    const sections = React.useMemo(() => {
        const groups = {};
        items.forEach(item => { if (item.isHeader) groups[item.id] = { section: item, partitions: [] }; else if (item.sectionId && groups[item.sectionId]) groups[item.sectionId].partitions.push(item); });
        return Object.values(groups);
    }, [items]);

    React.useEffect(() => { const init = {}; sections.forEach(g => { init[g.section.id] = true; }); setExpandedSections(init); }, [sections]);
    const toggleSection = (id) => setExpandedSections(prev => ({ ...prev, [id]: !prev[id] }));
    const handleClick = (p) => { if (p.isHeader) return; if (onSelectItem) onSelectItem(p); navigate(p.href || `/learnings/${classId}/${p.sectionId}/${p.id}`); };

    return (
        <div className="p-3">
            {sections.map((group) => (
                <div key={group.section.id} className="mb-3">
                    <button type="button" onClick={() => toggleSection(group.section.id)} className="w-full flex items-center justify-between px-4 py-3 text-left bg-neutral-50 hover:bg-yellow-50 border-2 border-neutral-200 hover:border-yellow-400 transition-all">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`w-8 h-8 flex items-center justify-center border-2 border-black ${group.section.isCompleted ? 'bg-yellow-400' : 'bg-white'}`}>{group.section.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-black">{group.partitions.filter(p => p.isCompleted).length}/{group.partitions.length}</span>}</div>
                            <span className="text-sm font-bold text-black truncate uppercase">{group.section.title}</span>
                        </div>
                        <div className={`transition-transform ${expandedSections[group.section.id] ? 'rotate-90' : ''}`}><svg className="w-5 h-5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg></div>
                    </button>
                    {expandedSections[group.section.id] && (
                        <div className="mt-2 ml-3 space-y-1.5 border-l-2 border-neutral-200 pl-3">
                            {group.partitions.map((p) => {
                                const isActive = String(p.id) === String(activeId);
                                return (
                                    <div key={p.id} className="relative">
                                        {isActive && <div className="absolute -left-3 top-0 bottom-0 w-0.5 bg-yellow-400" />}
                                        <button type="button" onClick={() => handleClick(p)} className={`w-full text-left px-3 py-2.5 flex items-center gap-3 transition-all ${isActive ? 'bg-yellow-50 border-2 border-yellow-400' : 'hover:bg-neutral-50 border-2 border-transparent hover:border-neutral-200'}`}>
                                            <div className="flex-shrink-0">{p.isCompleted ? <div className="w-5 h-5 bg-yellow-400 border-2 border-black flex items-center justify-center"><CheckCircle2 className="w-3.5 h-3.5" /></div> : <div className={`w-5 h-5 border-2 flex items-center justify-center ${isActive ? 'border-yellow-400 bg-yellow-400' : 'border-neutral-300 bg-white'}`}><div className={`w-1.5 h-1.5 ${isActive ? 'bg-black' : 'bg-neutral-300'}`} /></div>}</div>
                                            <Tooltip title={p.title} placement="right"><span className={`text-sm font-medium truncate ${isActive ? 'text-black font-bold' : 'text-neutral-700'}`}>{p.title}</span></Tooltip>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            ))}
            {items.length === 0 && <div className="px-3 py-6 text-xs text-neutral-500 text-center uppercase font-bold">{t('sectionLayout.noSessionItems')}</div>}
        </div>
    );
}
