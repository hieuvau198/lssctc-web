import { Alert, Button, Card, Skeleton, Tabs } from 'antd';
import { BookOpen, Video, Plus } from 'lucide-react';
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

  // mapping: learningMaterialTypeId === 1 => doc, === 2 => video
  const docs = materials.filter((m) => Number(m.typeId) === 2);
  const videos = materials.filter((m) => Number(m.typeId) === 1);
  const [viewMode, setViewMode] = useState('table');

  // Remove page-level add/edit mode rendering; use drawers instead

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{t('instructor.materials.title')}</span>
              <p className="text-indigo-100 text-sm mt-1">{docs.length + videos.length} {t('instructor.materials.totalMaterials')}</p>
            </div>
          </div>
          <Button 
            size="large"
            className="bg-white text-indigo-600 hover:bg-indigo-50 border-0 shadow-md"
            icon={<Plus className="w-5 h-5" />}
            onClick={() => setCreateDrawerVisible(true)}
          >
            {t('instructor.materials.createMaterial')}
          </Button>
        </div>
      </div>

      {/* Tabs + Content (merged into single card) */}
      <div className="bg-white rounded-xl shadow-lg py-2 px-6 border border-gray-200 mb-4">
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          type="line"
          size="large"
          className="mb-4"
        >
          <Tabs.TabPane
            key="docs"
            tab={(
              <span className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                {t('instructor.materials.docs')} <span className="text-sm text-gray-500">({docs.length})</span>
              </span>
            )}
          />
          <Tabs.TabPane
            key="videos"
            tab={(
              <span className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                {t('instructor.materials.videos')} <span className="text-sm text-gray-500">({videos.length})</span>
              </span>
            )}
          />
        </Tabs>

        {/* Loading / Error / Content inside the same card */}
        {loading ? (
          <div>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        ) : error ? (
          <div>
            <Alert type="error" message={t('common.error')} description={error} />
          </div>
        ) : (
          <div>
            {activeTab === 'videos' ? (
              <VideoMaterials materials={videos} viewMode={viewMode} onDelete={() => setRefreshKey(prev => prev + 1)} onEdit={(m) => { setEditingMaterial(m); setEditDrawerVisible(true); }} />
            ) : (
              <DocMaterials materials={docs} viewMode={viewMode} onDelete={() => setRefreshKey(prev => prev + 1)} onEdit={(m) => { setEditingMaterial(m); setEditDrawerVisible(true); }} />
            )}
          </div>
        )}
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
