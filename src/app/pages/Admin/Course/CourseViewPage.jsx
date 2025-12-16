import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Space, Popconfirm, message, Tag, Skeleton } from 'antd';
import { EditOutlined, DeleteOutlined, CloseOutlined, SaveOutlined } from '@ant-design/icons';
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
      <div className="relative w-full h-[300px] bg-slate-200 group">
        {course.backgroundImageUrl ? (
          <img 
            src={course.backgroundImageUrl} 
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
                    <Tag color={course.isActive ? 'green' : 'red'} className="border-none">
                        {course.isActive ? t('common.active') : t('common.inactive')}
                    </Tag>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-white m-0 shadow-sm drop-shadow-md">
                    {course.name}
                </h1>
                <div className="text-slate-300 text-sm mt-1 opacity-90 font-mono">
                    {course.courseCode} <span className="mx-2">•</span> ID: {course.id}
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
                
                <Popconfirm
                    title={t('admin.courses.deleteCourseTitle')}
                    description={t('admin.courses.deleteConfirm')}
                    onConfirm={handleDelete}
                    okButtonProps={{ loading: deleting, danger: true }}
                    okText={t('common.yes')}
                    cancelText={t('common.no')}
                >
                    <Button 
                        danger 
                        ghost 
                        icon={<DeleteOutlined />} 
                        loading={deleting}
                        className="border-red-400 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                        {t('common.delete')}
                    </Button>
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