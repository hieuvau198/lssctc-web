import { App, Button, Skeleton, Tag } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { fetchClassDetail, updateClass } from '../../../apis/ProgramManager/ClassApi';
import ClassDetailView from './partials/ClassDetailView';
import EditDeleteClassForm from './partials/EditDeleteClassForm';
import BackButton from '../../../components/BackButton/BackButton';
import EditClassStatus from '../../../components/ClassStatus/EditClassStatus';
import { getClassStatus } from '../../../utils/classStatus';

const ClassViewPage = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { id } = useParams();
  const [classItem, setClassItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const loadClassDetail = () => {
    if (!id) return;
    setLoading(true);
    fetchClassDetail(id)
      .then((d) => setClassItem(d))
      .catch((err) => {
        message.error(err?.message || t('admin.classes.loadError'));
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadClassDetail();
  }, [id]);

  const handleUpdate = async (values) => {
    setUpdating(true);
    try {
      await updateClass(id, {
        name: values.name,
        startDate: values.startDate.toISOString(),
        endDate: values.endDate.toISOString(),
        capacity: values.capacity,
        description: values.description,
        classCode: values.classCode,
        programId: values.programId,
        courseId: values.courseId,
        backgroundImageUrl: values.backgroundImageUrl, // Added backgroundImageUrl to payload
      });
      message.success(t('admin.classes.messages.updateSuccess'));
      setIsEditModalOpen(false);
      loadClassDetail();
    } catch (err) {
      message.error(err?.response?.data || err?.message || t('admin.classes.messages.updateFailed'));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8"><Skeleton active paragraph={{ rows: 10 }} /></div>;
  if (!classItem) return null;

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Background Section */}
      <div className="relative w-full h-[300px] bg-slate-200 group">
        {classItem.backgroundImageUrl ? (
          <img 
            src={classItem.backgroundImageUrl} 
            alt="Background" 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-200">
            No Background Image
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Header Content on Banner */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <div className="flex items-center gap-3 mb-2">
                    <BackButton className="text-white hover:text-slate-200" />
                    {/* Status Tag and Edit Status Component */}
                    <div className="flex items-center gap-2">
                         <Tag color={getClassStatus(classItem.status).color} className="border-none m-0">
                            {t(`common.classStatus.${getClassStatus(classItem.status).key}`)}
                        </Tag>
                        <EditClassStatus
                            classId={classItem.id}
                            status={classItem.status}
                            onSuccess={loadClassDetail}
                            size="small"
                        />
                    </div>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white m-0 shadow-sm drop-shadow-md">
                    {classItem.name}
                </h1>
                <div className="text-slate-300 text-sm mt-1 opacity-90 font-mono">
                   {classItem.classCode?.name || classItem.classCode || "NO CODE"} <span className="mx-2">•</span> ID: {classItem.id}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
                <Button 
                    ghost
                    icon={<EditOutlined />} 
                    onClick={() => setIsEditModalOpen(true)}
                    className="text-white border-white hover:text-blue-400 hover:border-blue-400"
                >
                    {t('common.edit')}
                </Button>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <ClassDetailView
            classItem={classItem}
            loading={loading}
            onRefresh={loadClassDetail}
        />
      </div>

      <EditDeleteClassForm
        open={isEditModalOpen}
        classItem={classItem}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdate}
        confirmLoading={updating}
        showDelete={false}
        embedded={false}
      />
    </div>
  );
};

export default ClassViewPage;