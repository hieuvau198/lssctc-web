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

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchClassDetail(id)
      .then((d) => setClassItem(d))
      .catch((err) => {
        message.error(err?.message || 'Failed to load class');
      })
      .finally(() => setLoading(false));
  }, [id]);


  if (loading) return <Skeleton active paragraph={{ rows: 8 }} />;
  if (!classItem) return null;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <Button type="default" icon={<ArrowLeft size={16} />} onClick={() => navigate('/admin/class')}>Back</Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate(`/admin/class/${id}/edit`)}>Edit</Button>
          {/* <Popconfirm title="Delete class?" onConfirm={handleDelete}>
            <Button danger>Delete</Button>
          </Popconfirm> */}
        </div>
      </div>
      <ClassDetailView
        classItem={classItem}
        loading={loading}
        onRefresh={() => {
          fetchClassDetail(id).then(setClassItem);
        }}
      />
    </div>
  );
};

export default ClassViewPage;
