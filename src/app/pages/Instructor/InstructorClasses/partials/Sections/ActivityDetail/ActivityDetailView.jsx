import React from 'react';
import { Typography, Tag } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  LaptopOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import TraineeActivityRecords from './TraineeActivityRecords';

const { Title, Text, Paragraph } = Typography;

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
        <Tag>{activity.type}</Tag>
        <Tag>{activity.duration} minutes</Tag>
      </div>

      <Paragraph type="secondary" className="mb-6">
        {activity.description}
      </Paragraph>

      {/* Conditionally render Trainee Records.
        We don't need to show records for "Material"
      */}
      {activity.type?.toLowerCase() === 'quiz' || activity.type?.toLowerCase() === 'practice' ? (
        <TraineeActivityRecords
          classId={classId}
          sectionId={sectionId}
          activityId={activity.id}
        />
      ) : (
        <Text type="secondary">
          Trainee progress is not tracked for "Material" activities.
        </Text>
      )}
    </div>
  );
};

export default ActivityDetailView;