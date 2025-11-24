import React from 'react';
import { Card, Typography, Tag, Descriptions, Button, Tooltip } from 'antd';
import { Edit } from 'lucide-react';

const { Title } = Typography;

export default function PracticeInfoCard({ practice, onEdit }) {
  if (!practice) {
    return null;
  }

  const practiceInfoItems = [
    { label: "Code", value: practice.practiceCode || 'N/A' }, 
    { label: "Description", value: practice.practiceDescription || 'N/A' },
    { label: "Duration", value: `${practice.estimatedDurationMinutes} min` },
    { label: "Difficulty", value: <Tag color="blue">{practice.difficultyLevel || 'N/A'}</Tag> },
    { label: "Max Attempts", value: practice.maxAttempts },
    { label: "Status", value: <Tag color={practice.isActive ? 'green' : 'red'}>{practice.isActive ? 'Active' : 'Inactive'}</Tag> },
    { label: "Created Date", value: practice.createdDate ? new Date(practice.createdDate).toLocaleDateString() : 'N/A' }
  ];

  return (
    <Card 
      className="border-slate-200 shadow-sm"
      title={<Title level={4} className="!mb-0">{practice.practiceName}</Title>}
      extra={(
        <Tooltip title="Edit Practice">
          <Button 
            type="primary" 
            icon={<Edit className="w-4 h-4" />} 
            onClick={onEdit}
          />
        </Tooltip>
      )}
    >
      <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} size="small">
        {practiceInfoItems.map((item, index) => (
          <Descriptions.Item key={index} label={item.label}>
            {item.value}
          </Descriptions.Item>
        ))}
      </Descriptions>
    </Card>
  );
}