import { Alert, List, Skeleton, Tag, Button } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  LaptopOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getActivitiesBySectionId } from '../../../../apis/Instructor/InstructorSectionApi';
import ManageMaterialModal from './Sections/ManageMaterialModal';
import ManageQuizModal from './Sections/ManageQuizModal';

// Helper to get icon and color for each activity type
const getActivityTypeDetails = (type) => {
  switch (type?.toLowerCase()) {
    case 'material':
      return {
        icon: <BookOutlined />,
        color: 'blue',
        label: 'Material',
      };
    case 'quiz':
      return {
        icon: <QuestionCircleOutlined />,
        color: 'green',
        label: 'Quiz',
      };
    case 'practice':
      return {
        icon: <LaptopOutlined />,
        color: 'purple',
        label: 'Practice',
      };
    default:
      return {
        icon: <FileTextOutlined />,
        color: 'default',
        label: type || 'Activity',
      };
  }
};

const ActivityList = ({ sectionId, refreshKey }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isManageMaterialVisible, setIsManageMaterialVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [isManageQuizVisible, setIsManageQuizVisible] = useState(false);

  const fetchActivities = async () => {
    if (!sectionId) {
      setLoading(false);
      setError('No Section ID provided.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getActivitiesBySectionId(sectionId);
      setActivities(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [sectionId, refreshKey]);

  // --- Material Modal Handlers ---
  const openManageMaterial = (activity) => {
    setSelectedActivity(activity);
    setIsManageMaterialVisible(true);
  };

  const onMaterialModalUpdate = () => {
    setIsManageMaterialVisible(false);
    setSelectedActivity(null);
    fetchActivities(); // Re-fetch activities to show changes
  };

  const onMaterialModalClose = () => {
    setIsManageMaterialVisible(false);
    setSelectedActivity(null);
  };

  // --- Quiz Modal Handlers ---
  const openManageQuiz = (activity) => {
    setSelectedActivity(activity);
    setIsManageQuizVisible(true);
  };

  const onQuizModalUpdate = () => {
    setIsManageQuizVisible(false);
    setSelectedActivity(null);
    fetchActivities(); // Re-fetch activities to show changes
  };

  const onQuizModalClose = () => {
    setIsManageQuizVisible(false);
    setSelectedActivity(null);
  };

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 2 }} />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon className="m-4" />;
  }

  if (activities.length === 0) {
    return <div className="p-4 text-gray-500">No activities found for this section.</div>;
  }

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={activities}
        renderItem={(item) => {
          const typeDetails = getActivityTypeDetails(item.type);
          const actions = [];

          if (item.type?.toLowerCase() === 'material') {
            actions.push(
              <Button
                type="link"
                icon={<SettingOutlined />}
                onClick={() => openManageMaterial(item)}
              >
                Manage Material
              </Button>
            );
          } else if (item.type?.toLowerCase() === 'quiz') {
            actions.push(
              <Button
                type="link"
                icon={<SettingOutlined />}
                onClick={() => openManageQuiz(item)}
              >
                Manage Quiz
              </Button>
            );
          }
          // We can add "Manage Practice" buttons here later

          return (
            <List.Item actions={actions}>
              <List.Item.Meta
                avatar={
                  <Tag color={typeDetails.color} className="flex items-center justify-center w-10 h-10 text-lg">
                    {typeDetails.icon}
                  </Tag>
                }
                title={
                  <span className="font-medium text-gray-800">
                    {item.title}
                  </span>
                }
                description={
                  <div className="flex flex-col">
                    <span>{item.description}</span>
                    <span className="text-xs text-gray-500 mt-1">
                      {typeDetails.label} • {item.duration} minutes
                    </span>
                  </div>
                }
              />
            </List.Item>
          );
        }}
      />

      <ManageMaterialModal
        activity={selectedActivity}
        isVisible={isManageMaterialVisible}
        onClose={onMaterialModalClose}
        onUpdate={onMaterialModalUpdate}
      />

      <ManageQuizModal
        activity={selectedActivity}
        isVisible={isManageQuizVisible}
        onClose={onQuizModalClose}
        onUpdate={onQuizModalUpdate}
      />
    </>
  );
};

export default ActivityList;