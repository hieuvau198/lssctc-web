import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Space, Popconfirm, message } from 'antd';
import { ArrowLeftOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CourseDetail from './partials/CourseDetail';
import EditCourse from './partials/EditCourse';
import { deleteCourse, updateCourse, fetchCourseDetail } from '../../../apis/ProgramManager/CourseApi';

const CourseViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);
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
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/courses');
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

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={handleBack} 
        >
          {t('common.back')}
        </Button>
        
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => setIsEditModalOpen(true)}
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
              icon={<DeleteOutlined />} 
              loading={deleting}
            >
              {t('common.delete')}
            </Button>
          </Popconfirm>
        </Space>
      </div>
      
      {/* Reusing CourseDetail with embedded=true to utilize the detailed layout */}
      <CourseDetail id={id} embedded={true} course={course} />

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