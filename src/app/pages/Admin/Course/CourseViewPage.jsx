import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Space, Popconfirm, message, Tag, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, CloseOutlined, SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CourseDetail from './partials/CourseDetail';
import EditCourse from './partials/EditCourse';
import { deleteCourse, updateCourse, fetchCourseDetail } from '../../../apis/ProgramManager/CourseApi';
import BackButton from '../../../components/BackButton/BackButton';

const CourseViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (id) {
      loadCourse();
    }
  }, [id]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      const data = await fetchCourseDetail(id);
      setCourse(data);
    } catch (error) {
      console.error('Failed to load course details:', error);
      message.error(t('admin.courses.loadDetailError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteCourse(id);
      message.success(t('admin.courses.deleteSuccess'));
      navigate('/admin/courses');
    } catch (error) {
      message.error(error?.response?.data || error?.message || t('admin.courses.deleteError'));
    } finally {
      setDeleting(false);
    }
  };

  const handleUpdate = async (values) => {
    setUpdating(true);
    try {
      await updateCourse(id, values);
      message.success(t('admin.courses.updateSuccess'));
      setIsEditModalOpen(false);
      loadCourse(); // Reload details
    } catch (error) {
      message.error(error?.response?.data || error?.message || t('admin.courses.updateError'));
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-8"><Skeleton active paragraph={{ rows: 10 }} /></div>;
  if (!course) return null;

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Hero Background Section */}
      <div className="relative w-full h-[320px] bg-neutral-900 group border-b-4 border-yellow-400">
        {course.backgroundImageUrl ? (
          <img
            src={course.backgroundImageUrl}
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
                onClick={() => navigate('/admin/courses')}
                className="group flex items-center gap-2 px-3 py-1.5 bg-black/50 backdrop-blur-sm border border-white/30 text-white hover:bg-yellow-400 hover:border-yellow-400 hover:text-black transition-all uppercase text-xs font-bold tracking-wider"
              >
                <ArrowLeftOutlined /> {t('common.back')}
              </button>
              <div className={`px-3 py-1.5 text-xs font-black uppercase tracking-wider border ${course.isActive ? 'bg-green-500/20 border-green-500 text-green-400' : 'bg-red-500/20 border-red-500 text-red-400'}`}>
                {course.isActive ? t('common.active') : t('common.inactive')}
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-1.5 h-12 bg-yellow-400 self-stretch shadow-[0_0_15px_rgba(250,204,21,0.5)]" />
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white m-0 tracking-tight uppercase shadow-sm">
                  {course.name}
                </h1>
                <div className="text-neutral-400 text-sm mt-2 font-mono flex items-center gap-4">

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
              <EditOutlined className="group-hover:animate-bounce" />
              {t('common.edit')}
            </button>

            <Popconfirm
              title={t('admin.courses.deleteCourseTitle')}
              description={t('admin.courses.deleteConfirm')}
              onConfirm={handleDelete}
              okButtonProps={{ loading: deleting, danger: true, className: 'rounded-none border-red-500 bg-red-500 hover:bg-red-600' }}
              cancelButtonProps={{ className: 'rounded-none' }}
              okText={t('common.yes')}
              cancelText={t('common.no')}
            >
              <button
                className="flex items-center gap-2 px-5 py-2.5 bg-transparent border-2 border-red-500 text-red-500 font-bold uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all"
              >
                {deleting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <DeleteOutlined />}
                {t('common.delete')}
              </button>
            </Popconfirm>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <CourseDetail
          id={id}
          embedded={true}
          course={course}
        />
      </div>

      {/* Edit Modal */}
      {course && (
        <EditCourse
          open={isEditModalOpen}
          onCancel={() => setIsEditModalOpen(false)}
          onUpdate={handleUpdate}
          confirmLoading={updating}
          course={course}
          embedded={false} // Use Modal mode
        />
      )}
    </div>
  );
};

export default CourseViewPage;