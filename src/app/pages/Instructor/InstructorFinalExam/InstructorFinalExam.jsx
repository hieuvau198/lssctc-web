import { Card, Tabs, Empty, Skeleton } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TEExam from './partials/TEExam';
import SEExam from './partials/SEExam';
import PEExam from './partials/PEExam';
import { BookOutlined, FileTextOutlined, TrophyOutlined } from '@ant-design/icons';

export default function InstructorFinalExam() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState('te');

  if (!classId) {
    return (
      <div className="py-8">
        <Empty description={t('instructor.finalExam.noClass')} />
      </div>
    );
  }

  const tabItems = [
    {
      key: 'te',
      label: (
        <span className="flex items-center gap-2">
          <FileTextOutlined />
          {t('instructor.finalExam.teTab')}
        </span>
      ),
      children: <TEExam classId={classId} />,
    },
    {
      key: 'se',
      label: (
        <span className="flex items-center gap-2">
          <BookOutlined />
          {t('instructor.finalExam.seTab')}
        </span>
      ),
      children: <SEExam classId={classId} />,
    },
    {
      key: 'pe',
      label: (
        <span className="flex items-center gap-2">
          <TrophyOutlined />
          {t('instructor.finalExam.peTab')}
        </span>
      ),
      children: <PEExam classId={classId} />,
    },
  ];

  return (
    <div className="py-4">
      <Card
        title={
          <div className="flex flex-1 items-center gap-2">
            <TrophyOutlined className="text-blue-500" />
            <span className="text-xl font-semibold">{t('instructor.finalExam.title')}</span>
          </div>
        }
        className="shadow-sm"
      >

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
          size="large"
        />
      </Card>
    </div>
  );
}
