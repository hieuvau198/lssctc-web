import { Alert, List, Skeleton, Tag } from 'antd';
import {
  BookOutlined,
  FileTextOutlined,
  LaptopOutlined,
  LoadingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getActivitiesBySectionId } from '../../../../apis/Instructor/InstructorSectionApi';

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

const ActivityList = ({ sectionId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!sectionId) {
      setLoading(false);
      setError('No Section ID provided.');
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // Uses new API function
        const data = await getActivitiesBySectionId(sectionId);
        if (!cancelled) {
          setActivities(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load activities');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [sectionId]);

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
    <List
      itemLayout="horizontal"
      dataSource={activities}
      renderItem={(item) => {
        const typeDetails = getActivityTypeDetails(item.type); // Uses mapped property
        return (
          <List.Item>
            <List.Item.Meta
              avatar={
                <Tag color={typeDetails.color} className="flex items-center justify-center w-10 h-10 text-lg">
                  {typeDetails.icon}
                </Tag>
              }
              title={
                <span className="font-medium text-gray-800">
                  {item.title} {/* Uses mapped property */}
                </span>
              }
              description={
                <div className="flex flex-col">
                  <span>{item.description}</span> {/* Uses mapped property */}
                  <span className="text-xs text-gray-500 mt-1">
                    {typeDetails.label} • {item.duration} minutes {/* Uses mapped property */}
                  </span>
                </div>
              }
            />
          </List.Item>
        );
      }}
    />
  );
};

export default ActivityList;