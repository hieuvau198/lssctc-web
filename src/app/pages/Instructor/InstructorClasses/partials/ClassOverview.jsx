import React from 'react';
import { Card, Descriptions, Tag } from 'antd';
import { getProgramName } from '../../../../mock/instructorClasses';

const ClassOverview = ({ classData }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return status === '1' ? 'green' : 'orange';
  };

  const getStatusText = (status) => {
    return status === '1' ? 'Active' : 'Inactive';
  };

  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  return (
    <div className="mb-6 rounded-2xl shadow-xl">
      <Card className="py-80">
        <Descriptions
          title={
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold leading-tight m-0">{classData.name}</h2>
                <div className="text-sm text-gray-500 mt-1">Program: {getProgramName(classData.programCourseId)}</div>
              </div>
            </div>
          }
          bordered
          column={{ xs: 1, sm: 2, md: 2, lg: 2, xl: 2, xxl: 2 }}
          size="default"
          labelStyle={{ fontSize: 14, fontWeight: 600, paddingRight: 16, minWidth: 140 }}
          contentStyle={{ fontSize: 14 }}
        >
          <Descriptions.Item label="Class Code" span={1}>
            <span className="font-mono font-medium text-sm">{classData.classCode.name}</span>
          </Descriptions.Item>
          <Descriptions.Item label="Capacity" span={1}>
            <div className="text-sm">{classData.capacity} students</div>
          </Descriptions.Item>
          <Descriptions.Item label="Start Date" span={1}>
            <div className="text-sm">{formatDate(classData.startDate)}</div>
          </Descriptions.Item>
          <Descriptions.Item label="End Date" span={1}>
            <div className="text-sm">{formatDate(classData.endDate)}</div>
          </Descriptions.Item>
          <Descriptions.Item label="Duration" span={1}>
            <div className="text-sm">{calculateDuration(classData.startDate, classData.endDate)}</div>
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={1}>
            <Tag color={getStatusColor(classData.status)} style={{ fontSize: 12, padding: '2px 8px' }}>
              {getStatusText(classData.status)}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="Description" span={2}>
            <div
              className="overflow-y-auto pr-2 text-gray-700 leading-relaxed"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#cbd5e1 #f1f5f9', maxHeight: '40vh' }}
            >
              {classData.description || 'No description available'}
            </div>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ClassOverview;
