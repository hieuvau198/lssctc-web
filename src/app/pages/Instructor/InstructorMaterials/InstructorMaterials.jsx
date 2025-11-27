import { Button, Skeleton, Alert } from 'antd';
import { BookOpen, Video, Plus, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
import { getLearningMaterials } from '../../../apis/Instructor/InstructorSectionApi';
import AddMaterials from './partials/AddMaterials';
import EditMaterials from './partials/EditMaterials';
import MaterialsList from './partials/MaterialsList';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function InstructorMaterials() {
  const query = useQuery();
  const { id } = useParams();
  const isAddMode = query.get('mode') === 'add';
  const isEditMode = !!id;
  const navigate = useNavigate();
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
        setError(err?.message || 'Failed to load materials');
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

  if (isAddMode) {
    return <AddMaterials onSuccess={() => {
      setRefreshKey(prev => prev + 1);
      navigate('/instructor/materials');
    }} />;
  }

  if (isEditMode) {
    return <EditMaterials onSuccess={() => {
      setRefreshKey(prev => prev + 1);
      navigate('/instructor/materials');
    }} />;
  }

  const currentCount = activeTab === 'docs' ? docs.length : videos.length;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1">
            <span className="uppercase tracking-wider text-xs">Instructor</span>
            <ChevronRight className="h-4 w-4" />
            <span className="uppercase tracking-wider text-xs">Materials</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Materials Management
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl">
            Manage your learning materials including documents and videos.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Button
            type="primary"
            size="large"
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/instructor/materials?mode=add')}
            className="!flex !items-center !gap-2 !bg-blue-600 hover:!bg-blue-700 !h-12 !px-6 !rounded-xl !text-sm !font-bold !shadow-lg !shadow-blue-600/30 transition-all duration-300 hover:!scale-105"
          >
            Create Material
          </Button>

          <div className="hidden md:block text-right px-6 py-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="text-2xl font-bold text-gray-900">{currentCount}</div>
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total {activeTab === 'docs' ? 'Docs' : 'Videos'}</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('docs')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'docs'
              ? 'bg-white text-blue-600 shadow-lg shadow-gray-200/50 ring-1 ring-gray-100'
              : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
            }`}
        >
          <BookOpen className={`w-5 h-5 ${activeTab === 'docs' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span>Documents</span>
          <span className={`ml-2 px-2 py-0.5 rounded-md text-xs ${activeTab === 'docs' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
            {docs.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('videos')}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${activeTab === 'videos'
              ? 'bg-white text-blue-600 shadow-lg shadow-gray-200/50 ring-1 ring-gray-100'
              : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
            }`}
        >
          <Video className={`w-5 h-5 ${activeTab === 'videos' ? 'text-blue-600' : 'text-gray-400'}`} />
          <span>Videos</span>
          <span className={`ml-2 px-2 py-0.5 rounded-md text-xs ${activeTab === 'videos' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
            }`}>
            {videos.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      ) : error ? (
        <Alert type="error" message="Error" description={error} showIcon className="rounded-xl" />
      ) : (
        <div>
          {activeTab === 'videos' ? (
            <MaterialsList
              materials={videos}
              type="video"
              onDelete={() => setRefreshKey(prev => prev + 1)}
            />
          ) : (
            <MaterialsList
              materials={docs}
              type="doc"
              onDelete={() => setRefreshKey(prev => prev + 1)}
            />
          )}
        </div>
      )}
    </div>
  );
}
