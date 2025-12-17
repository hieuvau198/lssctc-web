import { Tabs, Empty } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TEExam from './partials/TEExam';
import SEExam from './partials/SEExam';
import PEExam from './partials/PEExam';
import { FileText, Monitor, Award, Trophy } from 'lucide-react';

export default function InstructorFinalExam() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState('te');

  if (!classId) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <div className="bg-white border-2 border-black p-12">
          <div className="h-1 bg-yellow-400 -mx-12 -mt-12 mb-8" />
          <Empty
            description={<span className="font-bold text-neutral-600">{t('instructor.finalExam.noClass')}</span>}
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
        <span className="flex items-center gap-2 px-2 font-bold uppercase">
          <FileText className="w-4 h-4" />
          {t('instructor.finalExam.teTab')}
        </span>
      ),
      children: <TEExam classId={classId} />,
    },
    {
      key: 'se',
      label: (
        <span className="flex items-center gap-2 px-2 font-bold uppercase">
          <Monitor className="w-4 h-4" />
          {t('instructor.finalExam.seTab')}
        </span>
      ),
      children: <SEExam classId={classId} />,
    },
    {
      key: 'pe',
      label: (
        <span className="flex items-center gap-2 px-2 font-bold uppercase">
          <Award className="w-4 h-4" />
          {t('instructor.finalExam.peTab')}
        </span>
      ),
      children: <PEExam classId={classId} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
      {/* Light Wire Header */}
      <div className="bg-black border-2 border-black p-6 mb-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center">
            <Trophy className="w-7 h-7 text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">{t('instructor.finalExam.title')}</h1>
            <p className="text-yellow-400 text-sm mt-1 font-medium">{t('instructor.finalExam.subtitle')}</p>
          </div>
        </div>
      </div>

      {/* Tabs Card */}
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          type="card"
          size="large"
          className="[&_.ant-tabs-nav]:bg-neutral-50 [&_.ant-tabs-nav]:border-b-2 [&_.ant-tabs-nav]:border-neutral-200 [&_.ant-tabs-tab]:border-2 [&_.ant-tabs-tab]:border-neutral-300 [&_.ant-tabs-tab-active]:border-black [&_.ant-tabs-tab-active]:bg-yellow-400 [&_.ant-tabs-tab-active]:text-black"
        />
      </div>
    </div>
  );
}
