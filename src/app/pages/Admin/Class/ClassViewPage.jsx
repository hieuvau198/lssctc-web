import { App, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchClassDetail, updateClass } from '../../../apis/ProgramManager/ClassApi';
import ClassDetailView from './partials/ClassDetailView';
import EditDeleteClassForm from './partials/EditDeleteClassForm';
import { getClassStatus } from '../../../utils/classStatus';
import { ArrowLeft, Edit } from 'lucide-react';

const ClassViewPage = () => {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
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
        backgroundImageUrl: values.backgroundImageUrl,
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

  const statusInfo = getClassStatus(classItem.status);

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Background Section */}
      <div className="relative w-full h-[320px] bg-neutral-900 group border-b-4 border-yellow-400">
        {classItem.backgroundImageUrl ? (
          <img
            src={classItem.backgroundImageUrl}
            alt="Background"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-600 bg-neutral-900 absolute inset-0">
            <div className="bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] absolute inset-0 opacity-20"></div>
          </div>
        )}

        {/* Overlay Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] bg-[position:0_0,0_0] animate-gradient-xy opacity-20" />

        {/* Header Content on Banner */}
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-10 text-white flex flex-col md:flex-row justify-between items-end gap-6 z-10">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate('/admin/class')}
                className="group flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm border border-white/30 text-white hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-all uppercase text-xs font-bold tracking-wider"
              >
                <ArrowLeft className="w-4 h-4" /> {t('common.back')}
              </button>

              {/* Status Badge */}
              <div className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border ${statusInfo.key === 'Open' || statusInfo.key === 'Inprogress'
                ? 'bg-green-500/20 border-green-500 text-green-400'
                : statusInfo.key === 'Completed'
                  ? 'bg-blue-500/20 border-blue-500 text-blue-400'
                  : statusInfo.key === 'Cancelled'
                    ? 'bg-red-500/20 border-red-500 text-red-400'
                    : 'bg-yellow-500/20 border-yellow-500 text-yellow-400'
                }`}>
                {t(`common.classStatus.${statusInfo.key}`)}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1.5 h-12 bg-yellow-400 self-stretch shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              <div>
                <span className="text-4xl md:text-5xl font-black text-white m-0 tracking-tight uppercase shadow-sm">
                  {classItem.name}
                </span>
                <div className="text-neutral-400 text-sm mt-2 font-mono flex items-center gap-4">
                  <span className="bg-white/10 px-2 py-0.5 border border-white/20">
                    CODE: {classItem.classCode?.name || classItem.classCode || "NO CODE"}
                  </span>
                  <span className="text-yellow-500">ID: #{classItem.id}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-transparent border-2 border-white text-white font-bold uppercase tracking-wider hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-all group"
            >
              <Edit className="w-4 h-4 group-hover:animate-bounce" />
              {t('common.edit')}
            </button>
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