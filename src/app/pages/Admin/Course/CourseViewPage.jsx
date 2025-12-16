import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import CourseDetail from './partials/CourseDetail';

const CourseViewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleBack = () => {
    navigate('/admin/courses');
  };

  return (
    <div className="p-4 md:p-8">
      <Button 
        icon={<ArrowLeftOutlined />} 
        onClick={handleBack} 
        className="mb-4"
      >
        {t('common.back')}
      </Button>
      
      {/* Reusing CourseDetail with embedded=true to utilize the detailed layout */}
      <CourseDetail id={id} embedded={true} />
    </div>
  );
};

export default CourseViewPage;