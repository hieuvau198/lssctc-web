import { App, Button, Skeleton } from 'antd';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClassDetail } from '../../../apis/ProgramManager/ClassApi';
import ClassDetailView from './partials/ClassDetailView';

const ClassViewPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const { id } = useParams();
  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadClassDetail = () => {
    if (!id) return;
    setLoading(true);
    fetchClassDetail(id)
      .then((d) => setClassItem(d))
      .catch((err) => {
        message.error(err?.message || 'Failed to load class');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClassDetail();
  }, [id]);

  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (!classItem) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <ClassDetailView
        classItem={classItem}
        loading={loading}
        onRefresh={loadClassDetail}
      />
    </div>
  );
};

export default ClassViewPage;
