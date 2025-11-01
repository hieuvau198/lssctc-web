import { BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Skeleton } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import ViewModeToggle from '../../../components/ViewModeToggle/ViewModeToggle';
import { useLocation } from 'react-router';
import { getLearningMaterials } from '../../../apis/Instructor/InstructorSectionApi';
import DocMaterials from './partials/DocMaterials';
import VideoMaterials from './partials/VideoMaterials';
import AddMaterials from './partials/AddMaterials';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function InstructorMaterials() {
  const query = useQuery();
  const isAddMode = query.get('mode') === 'add';
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('docs'); // 'videos' | 'docs'

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        // fetch all materials (no section filter)
        const res = await getLearningMaterials({ page: 1, pageSize: 200 });
        if (cancelled) return;
        setMaterials(Array.isArray(res.items) ? res.items : []);
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || 'Failed to load materials');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  // mapping: learningMaterialTypeId === 1 => doc, === 2 => video
  const docs = materials.filter((m) => Number(m.typeId) === 1);
  const videos = materials.filter((m) => Number(m.typeId) === 2);
  const [viewMode, setViewMode] = useState('table');

  if (isAddMode) {
    return <AddMaterials />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-2xl">Materials</span>
        </div>
        <div className="flex items-center gap-3">
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
            <VideoMaterials materials={videos} viewMode={viewMode} />
          ) : (
            <DocMaterials materials={docs} viewMode={viewMode} />
          )}
        </div>
      )}
    </div>
  );
}
