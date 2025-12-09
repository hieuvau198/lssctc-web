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
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="bg-white rounded-xl shadow-lg p-12">
          <Empty 
            description={t('instructor.finalExam.noClass')}
            image={<div className="text-8xl mb-4">🏆</div>}
          />
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'te',
      label: (
        <span className="flex items-center gap-2 px-2">
          <FileTextOutlined />
          {t('instructor.finalExam.teTab')}
        </span>
      ),
      children: <TEExam classId={classId} />,
    },
    {
      key: 'se',
      label: (
        <span className="flex items-center gap-2 px-2">
          <BookOutlined />
          {t('instructor.finalExam.seTab')}
        </span>
      ),
      children: <SEExam classId={classId} />,
    },
    {
      key: 'pe',
      label: (
        <span className="flex items-center gap-2 px-2">
          <TrophyOutlined />
          {t('instructor.finalExam.peTab')}
        </span>
      ),
      children: <PEExam classId={classId} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/10 text-white backdrop-blur-sm rounded-xl flex items-center justify-center">
            <TrophyOutlined className="text-white text-2xl" />
          </div>
          <div>
            <span className="text-2xl font-bold text-white">{t('instructor.finalExam.title')}</span>
            <p className="text-yellow-100 text-sm mt-1">{t('instructor.finalExam.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
          size="large"
          className="modern-tabs"
        />
      </div>
    </div>
  );
}
