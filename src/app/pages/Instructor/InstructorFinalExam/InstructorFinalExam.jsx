import { Collapse, Empty } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TEExam from './partials/TEExam';
import SEExam from './partials/SEExam';
import PEExam from './partials/PEExam';
import { FileText, Monitor, Award, Trophy, ChevronRight } from 'lucide-react';

const { Panel } = Collapse;

// Panel Header Component (similar to SectionHeader in ClassSections)
const ExamPanelHeader = ({ icon: Icon, title, subtitle }) => (
  <div className="flex justify-between items-center w-full">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
        <Icon className="w-4 h-4 text-black" />
      </div>
      <div>
        <span className="font-bold text-black uppercase tracking-tight">
          {title}
        </span>
        {subtitle && (
          <span className="ml-2 text-xs text-neutral-500 font-medium">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default function InstructorFinalExam() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [activeKeys, setActiveKeys] = useState(['te']);

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

  const examPanels = [
    {
      key: 'te',
      icon: FileText,
      title: t('instructor.finalExam.teTab'),
      component: <TEExam classId={classId} />,
    },
    {
      key: 'se',
      icon: Monitor,
      title: t('instructor.finalExam.seTab'),
      component: <SEExam classId={classId} />,
    },
    {
      key: 'pe',
      icon: Award,
      title: t('instructor.finalExam.peTab'),
      component: <PEExam classId={classId} />,
    },
  ];

  return (
    <div className="bg-white border-2 border-black overflow-hidden">
      <div className="h-1 bg-yellow-400" />
      <div className="p-6 space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
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
              className="mb-3 overflow-hidden border-2 border-neutral-200 hover:border-yellow-400 transition-all bg-white [&>.ant-collapse-header]:bg-neutral-50 [&>.ant-collapse-header]:border-b-2 [&>.ant-collapse-header]:border-neutral-200"
            >
              {panel.component}
            </Panel>
          ))}
        </Collapse>
      </div>
    </div>
  );
}
