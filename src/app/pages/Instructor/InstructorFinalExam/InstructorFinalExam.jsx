import { Collapse, Empty, Modal, message, Tooltip } from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import TEExam from './partials/TEExam';
import SEExam from './partials/SEExam';
import PEExam from './partials/PEExam';
import { FileText, Monitor, Award, Trophy, CheckCircle, AlertTriangle, Lock, ChevronRight, Play, PauseCircle } from 'lucide-react';
import InstructorFEApi from '../../../apis/Instructor/InstructorFEApi';

const { Panel } = Collapse;

// Panel Header Component (similar to SectionHeader in ClassSections)
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

export default function InstructorFinalExam() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const [activeKeys, setActiveKeys] = useState(['te']);
  const [loading, setLoading] = useState(false);
  const [examStatus, setExamStatus] = useState(null);

  const [modal, contextHolder] = Modal.useModal();

  useEffect(() => {
    const fetchStatus = async () => {
      if (!classId) return;
      try {
        const response = await InstructorFEApi.getClassConfig(classId);
        setExamStatus(response.data?.status);
      } catch (error) {
        console.error("Failed to fetch exam status", error);
      }
    };
    fetchStatus();
  }, [classId]);

  const handleOpenExam = () => {
    modal.confirm({
      title: <span className="font-bold uppercase">{t('instructor.finalExam.openConfirmTitle', 'Mở bài kiểm tra cuối kỳ')}</span>,
      icon: <AlertTriangle className="text-yellow-500 w-6 h-6 mr-2" />,
      content: (
        <div className="text-neutral-600 mt-2">
          <p>{t('instructor.finalExam.openConfirmContent', 'Bạn có chắc chắn muốn mở bài kiểm tra cuối kỳ cho lớp học này không?')}</p>
          <p className="font-bold mt-2 text-yellow-600 uppercase text-xs">
            {t('instructor.finalExam.openWarning', 'Cảnh báo: Học viên sẽ có thể bắt đầu bài kiểm tra ngay lập tức.')}
          </p>
        </div>
      ),
      okText: t('common.confirm', 'CONFIRM'),
      cancelText: t('common.cancel', 'CANCEL'),
      okButtonProps: {
        className: 'bg-black hover:!bg-neutral-800 border-none font-bold uppercase',
      },
      cancelButtonProps: {
        className: 'font-bold uppercase border-2 border-neutral-300 hover:!border-black hover:!text-black'
      },
      onOk: async () => {
        try {
          setLoading(true);
          await InstructorFEApi.openClassExam(classId);
          message.success(t('instructor.finalExam.openSuccess', 'Mở bài kiểm tra cuối kỳ thành công!'));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error("Error in openClassExam:", error);
          message.error(t('instructor.finalExam.openError', 'Mở bài kiểm tra thất bại.'));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handlePauseExam = () => {
    modal.confirm({
      title: <span className="font-bold uppercase">{t('instructor.finalExam.pauseConfirmTitle', 'Tạm dừng bài kiểm tra')}</span>,
      icon: <AlertTriangle className="text-yellow-500 w-6 h-6 mr-2" />,
      content: (
        <div className="text-neutral-600 mt-2">
          <p>{t('instructor.finalExam.pauseConfirmContent', 'Bạn có chắc chắn muốn tạm dừng bài kiểm tra? Học viên sẽ không thể truy cập bài làm nữa.')}</p>
          <p className="font-bold mt-2 text-yellow-600 uppercase text-xs">
            {t('instructor.finalExam.pauseWarning', 'Lưu ý: Trạng thái sẽ trở về "Chưa bắt đầu".')}
          </p>
        </div>
      ),
      okText: t('common.confirm', 'CONFIRM'),
      cancelText: t('common.cancel', 'CANCEL'),
      okButtonProps: {
        className: 'bg-black hover:!bg-neutral-800 border-none font-bold uppercase',
      },
      cancelButtonProps: {
        className: 'font-bold uppercase border-2 border-neutral-300 hover:!border-black hover:!text-black'
      },
      onOk: async () => {
        try {
          setLoading(true);
          // Call the new API endpoint
          await InstructorFEApi.pauseClassExam(classId);
          message.success(t('instructor.finalExam.pauseSuccess', 'Đã tạm dừng bài kiểm tra thành công!'));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error("Error in pauseClassExam:", error);
          message.error(t('instructor.finalExam.pauseError', 'Tạm dừng thất bại.'));
        } finally {
          setLoading(false);
        }
      },
    });
  };

  const handleFinishExam = () => {
    modal.confirm({
      title: <span className="font-bold uppercase">{t('instructor.finalExam.finishConfirmTitle', 'Kết thúc bài kiểm tra')}</span>,
      icon: <AlertTriangle className="text-yellow-500 w-6 h-6 mr-2" />,
      content: (
        <div className="text-neutral-600 mt-2">
          <p>{t('instructor.finalExam.finishConfirmContent', 'Bạn có chắc chắn muốn kết thúc bài kiểm tra cuối kỳ cho lớp học này không?')}</p>
          <p className="font-bold mt-2 text-red-600 uppercase text-xs">
            {t('instructor.finalExam.warning', 'Cảnh báo: Hành động này sẽ tính toán tất cả điểm số và chốt kết quả. Thao tác này không thể hoàn tác.')}
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
        try {
          setLoading(true);
          await InstructorFEApi.finishClassExam(classId);
          message.success(t('instructor.finalExam.finishSuccess', 'Kết thúc bài kiểm tra thành công!'));
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        } catch (error) {
          console.error("Error in finishClassExam:", error);
          message.error(t('instructor.finalExam.finishError', 'Kết thúc bài kiểm tra thất bại.'));
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
    <div className="max-w-7xl mx-auto">
      {contextHolder}

      {/* Light Wire Header */}
      <div className="bg-neutral-800 border-2 border-black p-6 mb-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">

          {/* Title Section */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-yellow-400 border-2 border-black flex items-center justify-center shrink-0">
              <Trophy className="w-7 h-7 text-black" />
            </div>
            <div>
              <span className="text-2xl font-black text-white uppercase tracking-tight">{t('instructor.finalExam.title')}</span>
              <p className="text-yellow-400 text-sm mt-1 font-medium">{t('instructor.finalExam.subtitle')}</p>
            </div>
          </div>

          {/* Action Button Section with Conditional Logic */}
          <div>
            {examStatus === 'NotYet' && (
              <Tooltip title={t('instructor.finalExam.tooltipNotYet')}>
                <button
                  onClick={handleOpenExam}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 font-black uppercase tracking-wide border-2 transition-all bg-yellow-400 text-black border-white hover:bg-yellow-500 active:bg-yellow-600 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Play className="w-5 h-5 fill-current" />
                  <span>{loading ? t('instructor.finalExam.processing') : t('instructor.finalExam.openButton')}</span>
                </button>
              </Tooltip>
            )}

            {examStatus === 'Open' && (
              <div className="flex items-center gap-3">
                {/* NEW: Pause Button */}
                <Tooltip title={t('instructor.finalExam.tooltipPause', 'Tạm dừng kiểm tra')}>
                  <button
                    onClick={handlePauseExam}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 font-black uppercase tracking-wide border-2 transition-all bg-white text-black border-black hover:bg-neutral-100 active:bg-neutral-200 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <PauseCircle className="w-5 h-5" />
                    <span>{loading ? t('instructor.finalExam.processing') : t('instructor.finalExam.pauseButton', 'Tạm Dừng')}</span>
                  </button>
                </Tooltip>

                {/* Existing Finish Button */}
                <Tooltip title={t('instructor.finalExam.tooltipFinish')}>
                  <button
                    onClick={handleFinishExam}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-3 font-black uppercase tracking-wide border-2 transition-all bg-red-500 text-white border-white hover:bg-red-600 active:bg-red-700 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] hover:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>{loading ? t('instructor.finalExam.processing') : t('instructor.finalExam.finishButton')}</span>
                  </button>
                </Tooltip>
              </div>
            )}

            {examStatus === 'Completed' && (
              <button
                disabled={true}
                className="flex items-center gap-2 px-6 py-3 font-black uppercase tracking-wide border-2 transition-all bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
              >
                <Lock className="w-5 h-5" />
                <span>{t('instructor.finalExam.closed')}</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Collapse Card - Similar to Sections */}
      <div className="bg-white border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
        <div className="h-1 bg-yellow-400" />
        <div className="p-6 space-y-3 max-h-[calc(100vh-280px)] overflow-y-auto">
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
    </div>
  );
}