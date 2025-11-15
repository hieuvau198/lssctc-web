import { Alert, Button, Card, Skeleton } from 'antd';
import { BookOpen, Video, Plus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router';
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
    
    // Luôn load materials khi refreshKey thay đổi hoặc khi quay lại từ edit/add mode
    if (!isAddMode && !isEditMode) {
      load();
    }
    return () => { cancelled = true; };
  }, [refreshKey, isAddMode, isEditMode]);

  // mapping: learningMaterialTypeId === 1 => doc, === 2 => video
  const docs = materials.filter((m) => Number(m.typeId) === 2);
  const videos = materials.filter((m) => Number(m.typeId) === 1);
  const [viewMode, setViewMode] = useState('table');

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

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl">Materials</span>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            type="primary" 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => navigate('/instructor/materials?mode=add')}
          >
            Create Material
          </Button>
          <Button.Group>
            <Button
              type={activeTab === 'docs' ? 'primary' : 'default'}
              icon={<BookOpen />}
              onClick={() => setActiveTab('docs')}
            >
              Docs
            </Button>
            <Button
              type={activeTab === 'videos' ? 'primary' : 'default'}
              icon={<Video />}
              onClick={() => setActiveTab('videos')}
            >
              Videos
            </Button>
          </Button.Group>
        </div>
      </div>

      {loading ? (
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      ) : error ? (
        <Alert type="error" message="Error" description={error} />
      ) : (
        <div>
          {activeTab === 'videos' ? (
            <VideoMaterials materials={videos} viewMode={viewMode} onDelete={() => setRefreshKey(prev => prev + 1)} />
          ) : (
            <DocMaterials materials={docs} viewMode={viewMode} onDelete={() => setRefreshKey(prev => prev + 1)} />
          )}
        </div>
      )}
    </div>
  );
}
