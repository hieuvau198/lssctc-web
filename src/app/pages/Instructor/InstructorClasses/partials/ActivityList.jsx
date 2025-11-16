import { Alert, List, Skeleton, Tag, Button, Drawer } from 'antd'; // <-- IMPORT Drawer
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
import ManagePracticeModal from './Sections/ManagePracticeModal';
import ActivityDetailView from './Sections/ActivityDetail/ActivityDetailView'; 

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

const ActivityList = ({ sectionId, classId, refreshKey }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedActivity, setSelectedActivity] = useState(null);
  // States for Modals
  const [isManageMaterialVisible, setIsManageMaterialVisible] = useState(false);
  const [isManageQuizVisible, setIsManageQuizVisible] = useState(false);
  const [isManagePracticeVisible, setIsManagePracticeVisible] = useState(false);

  // --- ADDED: State for Detail Drawer ---
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);

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

  // --- ADDED: Handlers for Detail Drawer ---
  const openDetailDrawer = (activity) => {
    setSelectedActivity(activity);
    setIsDetailDrawerVisible(true);
  };
  
  const closeDetailDrawer = () => {
    setIsDetailDrawerVisible(false);
    setSelectedActivity(null);
  };

  // --- Material Modal Handlers (modified to use one selectedActivity state) ---
  const openManageMaterial = (activity) => {
    setSelectedActivity(activity);
    setIsManageMaterialVisible(true);
  };
  const onMaterialModalUpdate = () => {
    setIsManageMaterialVisible(false);
    setSelectedActivity(null);
    fetchActivities(); 
  };
  const onMaterialModalClose = () => {
    setIsManageMaterialVisible(false);
    setSelectedActivity(null);
  };

  // --- Quiz Modal Handlers (modified) ---
  const openManageQuiz = (activity) => {
    setSelectedActivity(activity);
    setIsManageQuizVisible(true);
  };
  const onQuizModalUpdate = () => {
    setIsManageQuizVisible(false);
    setSelectedActivity(null);
    fetchActivities();
  };
  const onQuizModalClose = () => {
    setIsManageQuizVisible(false);
    setSelectedActivity(null);
  };

  // --- Practice Modal Handlers (modified) ---
  const openManagePractice = (activity) => {
    setSelectedActivity(activity);
    setIsManagePracticeVisible(true);
  };
  const onPracticeModalUpdate = () => {
    setIsManagePracticeVisible(false);
    setSelectedActivity(null);
    fetchActivities();
  };
  const onPracticeModalClose = () => {
    setIsManagePracticeVisible(false);
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

          // --- MODIFIED: Add "Manage" buttons based on type ---
          if (item.type?.toLowerCase() === 'material') {
            actions.push(
              <Button type="link" icon={<SettingOutlined />} onClick={(e) => { e.stopPropagation(); openManageMaterial(item); }}>
                Manage Material
              </Button>
            );
          } else if (item.type?.toLowerCase() === 'quiz') {
            actions.push(
              <Button type="link" icon={<SettingOutlined />} onClick={(e) => { e.stopPropagation(); openManageQuiz(item); }}>
                Manage Quiz
              </Button>
            );
          } else if (item.type?.toLowerCase() === 'practice') {
            actions.push(
              <Button type="link" icon={<SettingOutlined />} onClick={(e) => { e.stopPropagation(); openManagePractice(item); }}>
                Manage Practice
              </Button>
            );
          }

          return (
            <List.Item
              actions={actions}
              // --- MODIFIED: Make the item clickable to open the detail drawer ---
              onClick={() => openDetailDrawer(item)}
              className="hover:bg-gray-50 cursor-pointer"
            >
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

      {/* --- ADDED: Detail Drawer --- */}
      <Drawer
        title="Activity Details"
        placement="right"
        width={720}
        onClose={closeDetailDrawer}
        visible={isDetailDrawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
      >
        <ActivityDetailView
          activity={selectedActivity}
          classId={classId}
          sectionId={sectionId}
        />
      </Drawer>

      {/* --- All Modals (no structural changes) --- */}
      {selectedActivity && (
        <>
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
          
          <ManagePracticeModal
            activity={selectedActivity}
            isVisible={isManagePracticeVisible}
            onClose={onPracticeModalClose}
            onUpdate={onPracticeModalUpdate}
          />
        </>
      )}
    </>
  );
};

export default ActivityList;