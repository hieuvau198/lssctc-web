import { Skeleton, Alert, Empty } from 'antd';
import { BookOpen, Video, Plus, AlertCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getLearningMaterials } from '../../../apis/Instructor/InstructorSectionApi';
import AddMaterials from './partials/AddMaterials';
import EditMaterials from './partials/EditMaterials';
import DocMaterials from './partials/DocMaterials';
import VideoMaterials from './partials/VideoMaterials';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function InstructorMaterials() {
  const { t } = useTranslation();
  const query = useQuery();
  const { id } = useParams();
  const isAddMode = query.get('mode') === 'add';
  const isEditMode = !!id;
  const navigate = useNavigate();
  const [createDrawerVisible, setCreateDrawerVisible] = useState(false);
  const [editDrawerVisible, setEditDrawerVisible] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('docs'); // 'videos' | 'docs'
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        // fetch all materials (no section filter)
        const res = await getLearningMaterials({ page: 1, pageSize: 100 });
        if (cancelled) return;
        setMaterials(Array.isArray(res.items) ? res.items : []);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || t('instructor.materials.messages.loadFailed'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    // Load materials when:
    // 1. refreshKey changes (from add/edit success)
    // 2. When not in add/edit mode (after navigating back)
    if (!isAddMode && !isEditMode) {
      load();
    }
    return () => { cancelled = true; };
  }, [refreshKey, isAddMode, isEditMode]);

  // mapping: learningMaterialTypeId === 2 => doc, === 1 => video
  const docs = materials.filter((m) => Number(m.typeId) === 2);
  const videos = materials.filter((m) => Number(m.typeId) === 1);
  const [viewMode, setViewMode] = useState('table');

  // Tab configuration
  const tabs = [
    { key: 'docs', label: t('instructor.materials.docs'), icon: BookOpen, count: docs.length },
    { key: 'videos', label: t('instructor.materials.videos'), icon: Video, count: videos.length },
  ];

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-black border-2 border-black p-6 mb-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-neutral-800" />
        </div>
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton active paragraph={{ rows: 8 }} />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-4" />
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold uppercase">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
      {/* Header - Black background with yellow accent (matching MY CLASSES) */}
      <div className="flex-none bg-black border-2 border-black p-5 mb-4">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-2xl font-black text-white uppercase tracking-tight">
                {t('instructor.materials.title')}
              </span>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {docs.length + videos.length} {t('instructor.materials.totalMaterials')}
              </p>
            </div>
          </div>
          {/* Create Button */}
          <button
            onClick={() => setCreateDrawerVisible(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('instructor.materials.createMaterial')}
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="flex-1 flex flex-col bg-white border-2 border-black overflow-hidden relative">
        <div className="h-1 bg-yellow-400 flex-none" />

        {/* Tabs */}
        <div className="flex-none border-b-2 border-neutral-200">
          <div className="flex gap-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 font-bold uppercase tracking-wider text-sm border-b-4 transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === tab.key
                  ? 'border-yellow-400 text-black bg-yellow-50'
                  : 'border-transparent text-neutral-400 hover:text-black hover:border-neutral-300 hover:bg-neutral-50'
                  }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
                <span className={`ml-1 px-2 py-0.5 text-xs ${activeTab === tab.key
                  ? 'bg-yellow-400 text-black'
                  : 'bg-neutral-200 text-neutral-600'
                  }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden p-6">
          {activeTab === 'videos' ? (
            <VideoMaterials
              materials={videos}
              viewMode={viewMode}
              onDelete={() => setRefreshKey(prev => prev + 1)}
              onEdit={(m) => { setEditingMaterial(m); setEditDrawerVisible(true); }}
            />
          ) : (
            <DocMaterials
              materials={docs}
              viewMode={viewMode}
              onDelete={() => setRefreshKey(prev => prev + 1)}
              onEdit={(m) => { setEditingMaterial(m); setEditDrawerVisible(true); }}
            />
          )}
        </div>
      </div>

      {/* Drawers for Add / Edit Material */}
      <AddMaterials
        open={createDrawerVisible}
        onClose={() => setCreateDrawerVisible(false)}
        onSuccess={() => { setCreateDrawerVisible(false); setRefreshKey(prev => prev + 1); }}
      />

      <EditMaterials
        open={editDrawerVisible}
        onClose={() => { setEditDrawerVisible(false); setEditingMaterial(null); }}
        onSuccess={() => { setEditDrawerVisible(false); setEditingMaterial(null); setRefreshKey(prev => prev + 1); }}
        initialData={editingMaterial}
        materialId={editingMaterial?.id}
      />
    </div>
  );
}
