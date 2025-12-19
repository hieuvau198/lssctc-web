import { Tabs, Empty, Modal, message } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TEExam from './partials/TEExam';
import SEExam from './partials/SEExam';
import PEExam from './partials/PEExam';
import { FileText, Monitor, Award, Trophy, CheckCircle, AlertTriangle } from 'lucide-react';
import InstructorFEApi from '../../../apis/Instructor/InstructorFEApi';

export default function InstructorFinalExam() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [activeTab, setActiveTab] = useState('te');
  const [loading, setLoading] = useState(false);

  // [FIX] Use the useModal hook instead of the static method
  const [modal, contextHolder] = Modal.useModal();

  // Handler for finishing the exam
  const handleFinishExam = () => {    
    // Use 'modal.confirm' (instance) instead of 'Modal.confirm' (static)
    modal.confirm({
      title: <span className="font-bold uppercase">{t('instructor.finalExam.finishConfirmTitle', 'Finish Exam')}</span>,
      icon: <AlertTriangle className="text-yellow-500 w-6 h-6 mr-2" />,
      content: (
        <div className="text-neutral-600 mt-2">
          <p>{t('instructor.finalExam.finishConfirmContent', 'Are you sure you want to finish the final exam for this class?')}</p>
          <p className="font-bold mt-2 text-red-600 uppercase text-xs">
            {t('instructor.finalExam.warning', 'Warning: This will calculate all scores and finalize the results. This action cannot be undone.')}
          </p>
        </div>
      ),
      okText: t('common.confirm', 'CONFIRM'),
      cancelText: t('common.cancel', 'CANCEL'),
      okButtonProps: { 
        className: 'bg-black hover:!bg-neutral-800 border-none font-bold uppercase',
        danger: true 
      },
      cancelButtonProps: {
        className: 'font-bold uppercase border-2 border-neutral-300 hover:!border-black hover:!text-black'
      },
      onOk: async () => {
        console.log(">>> [DEBUG] Modal confirmed. Starting API call...");
        try {
          setLoading(true);
          await InstructorFEApi.finishClassExam(classId);
          console.log(">>> [DEBUG] API Call Success.");
          message.success(t('instructor.finalExam.finishSuccess', 'Final Exam concluded successfully!'));
          
          setTimeout(() => {
              window.location.reload();
          }, 1000);

        } catch (error) {
          console.error(">>> [DEBUG] Error in finishClassExam:", error);
          message.error(t('instructor.finalExam.finishError', 'Failed to conclude exam.'));
        } finally {
          setLoading(false);
        }
      },
    });
  };

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
      {/* [FIX] Render the contextHolder to display the modal */}
      {contextHolder}

      {/* Light Wire Header */}
      <div className="bg-black border-2 border-black p-6 mb-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">{t('instructor.finalExam.title')}</h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">{t('instructor.finalExam.subtitle')}</p>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleFinishExam}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-3 bg-yellow-400 hover:bg-yellow-500 active:bg-yellow-600 text-black font-black uppercase tracking-wide border-2 border-white transition-all shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{loading ? 'Processing...' : t('instructor.finalExam.finishButton', 'Conclude Exam')}</span>
          </button>

        </div>
      </div>

      {/* Tabs Card */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
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