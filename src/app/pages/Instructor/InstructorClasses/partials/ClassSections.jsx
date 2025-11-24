import { Alert, Collapse, Skeleton, Space, Typography, Button, Tooltip } from 'antd';
import { ClockCircleOutlined, ReadOutlined, PlusOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getSectionsByCourseId } from '../../../../apis/Instructor/InstructorSectionApi';
import ActivityList from './ActivityList';
import AddActivityModal from './Sections/AddActivityModal';

const { Panel } = Collapse;
const { Text } = Typography;

const SectionHeader = ({ title, duration }) => (
  <div className="flex justify-between items-center w-full">
    <div className="flex items-center gap-2">
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50">
        <ReadOutlined className="text-blue-600" />
      </div>
      <Text strong className="text-base text-slate-800">
        {title}
      </Text>
    </div>
    <Space size="small" className="text-sm text-slate-600 pr-2">
      <ClockCircleOutlined className="text-slate-500" />
      <span className="font-medium">{duration} minutes</span>
    </Space>
  </div>
);

const ClassSections = ({ courseId, classId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentSectionId, setCurrentSectionId] = useState(null);

  const [activityRefreshKeys, setActivityRefreshKeys] = useState({});

  useEffect(() => {
    if (!courseId) {
      setLoading(false);
      setError('Course ID is not available. Cannot load sections.');
      return;
    }

    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSectionsByCourseId(courseId);
        if (!cancelled) {
          setSections(data || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to load sections');
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
  }, [courseId]);

  const openAddActivityModal = (sectionId) => {
    setCurrentSectionId(sectionId);
    setIsAddModalVisible(true);
  };

  const handleActivityAdded = () => {
    setActivityRefreshKeys(prev => ({
      ...prev,
      [currentSectionId]: (prev[currentSectionId] || 0) + 1,
    }));
    setIsAddModalVisible(false);
    setCurrentSectionId(null);
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg border border-slate-200 p-4">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert 
          message="Error Loading Sections" 
          description={error} 
          type="error" 
          showIcon 
          className="rounded-lg"
        />
      </div>
    );
  }

  if (sections.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-slate-50 rounded-lg border border-slate-200 p-8 text-center">
          <ReadOutlined className="text-4xl text-slate-400 mb-3" />
          <p className="text-slate-600 font-medium mb-1">No Sections Available</p>
          <p className="text-sm text-slate-500">There are no sections available for this course yet.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
        <Collapse 
          accordion 
          bordered={false} 
          className="bg-transparent"
          expandIconPosition="end"
        >
          {sections.map((section, index) => (
            <Panel
              key={section.id}
              header={
                <SectionHeader
                  title={section.title}
                  duration={section.duration}
                />
              }
              extra={
                <Tooltip title="Add Activity">
                  <Button
                    type="primary"
                    size="small"
                    shape="circle"
                    icon={<PlusOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      openAddActivityModal(section.id);
                    }}
                    className="hover:scale-110 transition-transform"
                  />
                </Tooltip>
              }
              className="mb-3 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white"
              style={{ borderRadius: '12px' }}
            >
              <div className="bg-slate-50 -mx-6 -mt-4 px-6 py-3 mb-4 border-b border-slate-200">
                <p className="text-slate-700 leading-relaxed">{section.description}</p>
              </div>
              <ActivityList
                sectionId={section.id}
                classId={classId}
                refreshKey={activityRefreshKeys[section.id] || 0}
              />
            </Panel>
          ))}
        </Collapse>
      </div>

      <AddActivityModal
        sectionId={currentSectionId}
        isVisible={isAddModalVisible}
        onClose={() => setIsAddModalVisible(false)}
        onActivityAdded={handleActivityAdded}
      />
    </>
  );
};

export default ClassSections;