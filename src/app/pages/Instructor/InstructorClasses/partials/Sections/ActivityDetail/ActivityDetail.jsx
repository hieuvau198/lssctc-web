// src\app\pages\Instructor\InstructorClasses\partials\Sections\ActivityDetail\ActivityDetail.jsx

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumb, Skeleton, Alert, Typography } from 'antd';
import { HomeOutlined, BookOutlined, UserOutlined, ReadOutlined, LaptopOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import TraineeActivityRecords from './TraineeActivityRecords';
// We'll need an API to get the activity's own details, e.g., from InstructorSectionApi
// import { getActivityById } from '../../../../../../apis/Instructor/InstructorSectionApi'; // Assuming this exists

const { Title, Text } = Typography;

// Mock function until we have the real API
const getActivityDetailsMock = (activityId) => {
  console.log('Fetching details for activity:', activityId);
  return Promise.resolve({
    id: activityId,
    title: `Activity ${activityId} Title`,
    description: 'This is the description for the activity. Trainees will learn about...',
    type: 'Quiz', // This could be 'Practice' or 'Material'
  });
};

const ActivityDetail = () => {
  const { t } = useTranslation();
  // e.g., /instructor/classes/:classId/sections/:sectionId/activities/:activityId
  const { classId, sectionId, activityId } = useParams();
  
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch details for the activity itself
  useEffect(() => {
    setLoading(true);
    // TODO: Replace with your actual API call to get activity details
    getActivityDetailsMock(activityId)
      .then((data) => {
        setActivity(data);
      })
      .catch((err) => {
        setError(err.message || t('instructor.classes.activityDetail.loadFailed'));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [activityId]);

  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'material': return <ReadOutlined />;
      case 'quiz': return <QuestionCircleOutlined />;
      case 'practice': return <LaptopOutlined />;
      default: return <BookOutlined />;
    }
  };

  if (loading) {
    return <Skeleton active paragraph={{ rows: 3 }} />;
  }

  if (error) {
    return <Alert message={t('common.error')} description={error} type="error" showIcon />;
  }

  return (
    <div className="p-4 md:p-6">
      <Breadcrumb
        items={[
          { title: <Link to="/instructor/dashboard"><HomeOutlined /></Link> },
          { title: <Link to="/instructor/classes">{t('instructor.classes.activityDetail.breadcrumbClasses')}</Link> },
          { title: <Link to={`/instructor/classes/${classId}`}>{t('instructor.classes.activityDetail.breadcrumbClassDetails')}</Link> },
          { title: <><span className="mr-2">{getActivityIcon(activity.type)}</span>{activity.title}</> },
        ]}
        className="mb-4"
      />
      
      <Title level={2}>{activity.title}</Title>
      <Text type="secondary">{activity.description}</Text>

      {/* This component fetches and displays the trainee records */}
      <TraineeActivityRecords
        classId={classId}
        sectionId={sectionId}
        activityId={activityId}
        activityType={activity.type}  // <--- ADD THIS LINE
      />
    </div>
  );
};

export default ActivityDetail;