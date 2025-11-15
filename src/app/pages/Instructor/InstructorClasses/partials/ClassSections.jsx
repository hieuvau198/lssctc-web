import { Alert, Collapse, Skeleton, Space, Typography } from 'antd';
import { ClockCircleOutlined, ReadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { getSectionsByCourseId } from '../../../../apis/Instructor/InstructorSectionApi';
import ActivityList from './ActivityList';

const { Panel } = Collapse;
const { Text } = Typography;

const SectionHeader = ({ title, duration }) => (
  <div className="flex justify-between items-center w-full">
    <Text strong className="text-base">
      <ReadOutlined className="mr-2" />
      {title}
    </Text>
    <Space size="small" className="text-sm text-gray-600 pr-2">
      <ClockCircleOutlined />
      <span>{duration} minutes</span>
    </Space>
  </div>
);

const ClassSections = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        // Uses new API function
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

  if (loading) {
    return (
      <div className="p-4">
        <Skeleton active paragraph={{ rows: 4 }} />
      </div>
    );
  }

  if (error) {
    return <Alert message="Error" description={error} type="error" showIcon className="m-4" />;
  }

  if (sections.length === 0) {
    return (
      <div className="p-4">
        <Alert message="No Sections" description="There are no sections available for this course yet." type="info" showIcon />
      </div>
    );
  }

  return (
    <div className="py-4">
      <Collapse accordion bordered={false} className="bg-white">
        {sections.map((section) => (
          <Panel
            key={section.id}
            header={
              <SectionHeader
                title={section.title} // Uses mapped property
                duration={section.duration} // Uses mapped property
              />
            }
            className="mb-2 border rounded-lg shadow-sm"
          >
            <p className="pb-2 text-gray-700">{section.description}</p>
            {/* ActivityList will fetch its own data when this panel is opened */}
            <ActivityList sectionId={section.id} />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default ClassSections;