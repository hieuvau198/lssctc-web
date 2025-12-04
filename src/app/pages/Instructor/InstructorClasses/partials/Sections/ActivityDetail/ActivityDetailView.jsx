import React from 'react';
import { Typography, Tag } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  LaptopOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import TraineeActivityRecords from './TraineeActivityRecords';

const { Title, Paragraph } = Typography;

// Helper to get icon
const getActivityTypeIcon = (type) => {
  switch (type?.toLowerCase()) {
    case 'material':
      return <BookOutlined />;
    case 'quiz':
      return <QuestionCircleOutlined />;
    case 'practice':
      return <LaptopOutlined />;
    default:
      return <FileTextOutlined />;
  }
};

const ActivityDetailView = ({ activity, classId, sectionId }) => {
  const { t } = useTranslation();
  
  if (!activity) {
    return null;
  }

  return (
    <div>
      <Title level={3}>
        <span className="mr-2">{getActivityTypeIcon(activity.type)}</span>
        {activity.title}
      </Title>
      
      <div className="mb-4">
        <Tag color="blue">{activity.type}</Tag>
        <Tag>{activity.duration} {t('instructor.classes.activityDetail.minutes')}</Tag>
      </div>

      <Paragraph type="secondary" className="mb-6">
        {activity.description}
      </Paragraph>

      {/* Always render TraineeActivityRecords regardless of type.
         This allows viewing progress for Materials, Quizzes, and Practices.
      */}
      <TraineeActivityRecords
        classId={classId}
        sectionId={sectionId}
        activityId={activity.id}
      />
    </div>
  );
};

export default ActivityDetailView;