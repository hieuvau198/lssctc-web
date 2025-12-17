// src/app/pages/Admin/Class/partials/ClassCourseInfo.jsx
import React, { useEffect, useState } from 'react';
import { Card, Skeleton, Tag, Typography, Divider, Button, Tooltip } from 'antd';
import { 
  ReadOutlined, 
  BarcodeOutlined, 
  ClockCircleOutlined, 
  AppstoreOutlined, 
  ArrowRightOutlined 
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { fetchCourseDetail } from '../../../../apis/ProgramManager/CourseApi';

const { Title, Text, Paragraph } = Typography;

const ClassCourseInfo = ({ courseId }) => {
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadCourse();
    }
  }, [courseId]);

  const loadCourse = async () => {
    setLoading(true);
    try {
      // Assuming fetchCourseDetail returns the full course object
      const data = await fetchCourseDetail(courseId);
      setCourse(data);
    } catch (error) {
      console.error("Failed to load parent course info", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Card className="shadow-sm mb-6"><Skeleton active avatar paragraph={{ rows: 3 }} /></Card>;
  if (!course) return null;

  return (
    <Card 
      className=""
      title={
        <div className="flex items-center gap-2 text-slate-700">
          <ReadOutlined className="text-blue-600" />
          <span>Parent Course</span>
        </div>
      }
      extra={
        <Button 
          type="link" 
          size="small" 
          onClick={() => navigate(`/admin/courses/${course.id}`)}
          className="flex items-center gap-1"
        >
          View Course <ArrowRightOutlined />
        </Button>
      }
    >
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Left: Course Image */}
        <div className="w-full md:w-48 shrink-0">
          <div className="aspect-video rounded-lg overflow-hidden border border-slate-100 bg-slate-50 relative group">
            <img 
              src={course.imageUrl || '/placeholder-course.jpg'} 
              alt={course.name}
              className="w-full h-full object-cover"
              onError={(e) => {e.target.src = "https://placehold.co/600x400?text=No+Image"}}
            />
            <div className="absolute top-2 right-2">
                <Tag color={course.isActive ? "green" : "red"}>
                    {course.isActive ? "Active" : "Inactive"}
                </Tag>
            </div>
          </div>
        </div>

        {/* Right: Course Details */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="mb-2">
            <Text type="secondary" className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {course.code}
            </Text>
            <Title level={4} className="mt-0 mb-2 text-slate-800 leading-tight">
              {course.name}
            </Title>
          </div>

          <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-slate-600 mb-3">
            <div className="flex items-center gap-1.5">
               <AppstoreOutlined className="text-slate-400"/>
               <span>Category: <strong>{course.category || 'General'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
               <ClockCircleOutlined className="text-slate-400"/>
               <span>Duration: <strong>{course.durationHours ? `${course.durationHours} hrs` : 'N/A'}</strong></span>
            </div>
            {course.level && (
                 <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                        {course.level}
                    </span>
                 </div>
            )}
          </div>

          <Paragraph 
            ellipsis={{ rows: 2, expandable: true, symbol: 'more' }} 
            className="text-slate-500 mb-0 max-w-2xl"
          >
            {course.description || "No description available for this course."}
          </Paragraph>
        </div>
      </div>
    </Card>
  );
};

export default ClassCourseInfo;