import React from 'react';
import { Card, Typography, Tag, Descriptions, Button, Tooltip } from 'antd';
import { Edit } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const { Title } = Typography;

export default function PracticeInfoCard({ practice, onEdit }) {
  const { t } = useTranslation();
  
  if (!practice) {
    return null;
  }

  const practiceInfoItems = [
    { label: t('instructor.practices.info.code'), value: practice.practiceCode || t('instructor.practices.info.na') }, 
    { label: t('instructor.practices.info.description'), value: practice.practiceDescription || t('instructor.practices.info.na') },
    { label: t('instructor.practices.info.duration'), value: `${practice.estimatedDurationMinutes} ${t('instructor.practices.info.min')}` },
    { label: t('instructor.practices.info.difficulty'), value: <Tag color="blue">{practice.difficultyLevel || t('instructor.practices.info.na')}</Tag> },
    { label: t('instructor.practices.info.maxAttempts'), value: practice.maxAttempts },
    { label: t('instructor.practices.info.status'), value: <Tag color={practice.isActive ? 'green' : 'red'}>{practice.isActive ? t('instructor.practices.info.active') : t('instructor.practices.info.inactive')}</Tag> },
    { label: t('instructor.practices.info.createdDate'), value: practice.createdDate ? new Date(practice.createdDate).toLocaleDateString() : t('instructor.practices.info.na') }
  ];

  return (
    <Card 
      className="border-slate-200 shadow-sm"
      title={<Title level={4} className="!mb-0">{practice.practiceName}</Title>}
      extra={(
        <Tooltip title={t('simManager.practices.editPractice')}>
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