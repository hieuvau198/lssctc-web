import { BookOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { getLearningMaterials } from '../../../apis/Instructor/InstructorSectionApi';
import DocMaterials from './partials/DocMaterials';
import VideoMaterials from './partials/VideoMaterials';

export default function InstructorMaterials() {
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Materials</h1>
          <div className="text-gray-600">Manage your teaching materials</div>
        </div>
        <div>
          <Button.Group>
            <Button
              type={activeTab === 'videos' ? 'primary' : 'default'}
              icon={<VideoCameraOutlined />}
              onClick={() => setActiveTab('videos')}
            >
              Videos ({videos.length})
            </Button>
            <Button
              type={activeTab === 'docs' ? 'primary' : 'default'}
              icon={<BookOutlined />}
              onClick={() => setActiveTab('docs')}
            >
              Docs ({docs.length})
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
            <VideoMaterials materials={videos} />
          ) : (
            <DocMaterials materials={docs} />
          )}
        </div>
      )}
    </div>
  );
}
