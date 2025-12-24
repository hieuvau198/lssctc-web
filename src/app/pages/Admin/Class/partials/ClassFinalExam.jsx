import React, { useState } from 'react';
import { Collapse } from 'antd';
import { useTranslation } from 'react-i18next';
import { FileText, Monitor, Award, ChevronRight, Trophy } from 'lucide-react';
import ClassExamWeights from './ClassExamWeights';
import AdminTEConfig from './ExamPartials/AdminTEConfig';
import AdminSEConfig from './ExamPartials/AdminSEConfig';
import AdminPEConfig from './ExamPartials/AdminPEConfig';

const { Panel } = Collapse;

// Panel Header Component
const ExamPanelHeader = ({ icon: Icon, title }) => (
  <div className="flex justify-between items-center w-full">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
        <Icon className="w-4 h-4 text-black" />
      </div>
      <span className="font-bold text-black uppercase tracking-tight">
        {title}
      </span>
    </div>
  </div>
);

export default function ClassFinalExam({ classId, readOnly }) {
  const { t } = useTranslation();
  const [activeKeys, setActiveKeys] = useState(['te', 'se', 'pe']);

  const examPanels = [
    {
      key: 'te',
      icon: FileText,
      title: t('admin.finalExam.teTab', 'Theory Exam (TE)'),
      component: <AdminTEConfig classId={classId} readOnly={readOnly} />,
    },
    {
      key: 'se',
      icon: Monitor,
      title: t('admin.finalExam.seTab', 'Simulation Exam (SE)'),
      component: <AdminSEConfig classId={classId} readOnly={readOnly} />,
    },
    {
      key: 'pe',
      icon: Award,
      title: t('admin.finalExam.peTab', 'Practical Exam (PE)'),
      component: <AdminPEConfig classId={classId} readOnly={readOnly} />,
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Exam Weights Configuration */}
      <ClassExamWeights classId={classId} readOnly={readOnly} />

      {/* 2. Detailed Exam Content Configuration */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-sm">
        {/* Header similar to InstructorFinalExam */}
        <div className="bg-neutral-800 p-6 border-b-2 border-black">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-xl font-black text-white uppercase tracking-tight">
                {t('admin.finalExam.contentTitle', 'Exam Content Configuration')}
              </span>
              <p className="text-yellow-400 text-xs mt-1 font-medium uppercase tracking-wide">
                {t('admin.finalExam.contentSubtitle', 'Manage Quizzes, Practices, and Checklists')}
              </p>
            </div>
          </div>
        </div>

        {/* Accordion Content */}
        <div className="p-6 bg-white">
          <Collapse
            activeKey={activeKeys}
            onChange={(keys) => setActiveKeys(keys)}
            bordered={false}
            className="bg-transparent"
            expandIconPosition="end"
            expandIcon={({ isActive }) => (
              <ChevronRight className={`w-5 h-5 text-neutral-500 transition-transform ${isActive ? 'rotate-90' : ''}`} />
            )}
          >
            {examPanels.map((panel) => (
              <Panel
                key={panel.key}
                header={
                  <ExamPanelHeader
                    icon={panel.icon}
                    title={panel.title}
                  />
                }
                className="mb-4 overflow-hidden border-2 border-neutral-200 hover:border-black transition-all bg-white [&>.ant-collapse-header]:bg-neutral-50 [&>.ant-collapse-header]:border-b-2 [&>.ant-collapse-header]:border-neutral-200 [&>.ant-collapse-header]:py-4"
              >
                {panel.component}
              </Panel>
            ))}
          </Collapse>
        </div>
      </div>
    </div>
  );
}