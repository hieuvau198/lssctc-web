import React, { useEffect, useState } from 'react';
import { App, Button, Popconfirm, Skeleton } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClassDetail, deleteClass } from '../../../apis/ProgramManager/ClassApi';
import ClassDetailView from './partials/ClassDetailView';
import { ArrowLeft } from 'lucide-react';

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

  const handleDelete = async () => {
    try {
      await deleteClass(id);
      message.success('Class deleted');
      navigate('/admin/class');
    } catch (err) {
      message.error(err?.message || 'Delete failed');
    }
  };

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
      <ClassDetailView classItem={classItem} />
    </div>
  );
};

export default ClassViewPage;
