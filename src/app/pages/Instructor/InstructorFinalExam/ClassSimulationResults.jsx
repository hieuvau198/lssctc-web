// src/app/pages/Instructor/InstructorFinalExam/ClassSimulationResults.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Tag, Tooltip, App } from 'antd';
import {
  ArrowLeft,
  Trophy,
  CheckCircle,
  XCircle,
  User,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import InstructorFEApi from '../../../apis/Instructor/InstructorFEApi';

export default function ClassSimulationResults() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tasksMeta, setTasksMeta] = useState([]);
  const [practiceInfo, setPracticeInfo] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  useEffect(() => {
    fetchData();
  }, [classId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await InstructorFEApi.getClassSimulationResults(classId);
      const results = res.data || [];
      setData(results);

      // Use the first trainee's data as the standard for task columns
      // As per requirement: "lấy data của trainee đầu tiên làm chuẩn"
      if (results.length > 0 && results[0].simulationResult) {
        const firstResult = results[0].simulationResult;

        // Store practice info from the first result
        if (firstResult.practiceInfo) {
          setPracticeInfo(firstResult.practiceInfo);
        }

        // Setup task columns metadata
        if (firstResult.tasks && Array.isArray(firstResult.tasks)) {
          // Sort tasks by ID to ensure consistent order
          const sortedTasks = [...firstResult.tasks].sort((a, b) => a.id - b.id);
          setTasksMeta(sortedTasks.map(t => ({
            id: t.id,
            code: t.taskCode,
            name: t.name,
            description: t.description
          })));
        }
      }
    } catch (error) {
      console.error(error);
      message.error(t('instructor.finalExam.loadSimulationFailed'));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  // Define Table Columns
  const columns = [
    {
      title: t('instructor.finalExam.trainee'),
      key: 'trainee',
      fixed: 'left',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center flex-shrink-0">
            {record.avatarUrl ? (
              <img src={record.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-black" />
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-black">{record.traineeName}</span>
            <span className="text-neutral-500 text-xs font-medium">{record.traineeCode}</span>
          </div>
        </div>
      )
    },
    {
      title: t('instructor.finalExam.startTime'),
      dataIndex: ['simulationResult', 'startTime'],
      key: 'startTime',
      width: 160,
      render: (text) => <span className="text-neutral-600 text-sm font-medium">{formatDate(text)}</span>
    },
    {
      title: t('instructor.finalExam.completeTime'),
      dataIndex: ['simulationResult', 'completeTime'],
      key: 'completeTime',
      width: 160,
      render: (text) => <span className="text-neutral-600 text-sm font-medium">{formatDate(text)}</span>
    },
    {
      title: t('instructor.finalExam.status'),
      key: 'status',
      width: 140,
      render: (_, record) => {
        const result = record.simulationResult;
        if (!result) return <span className="px-3 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase">{t('instructor.finalExam.noData')}</span>;

        let bgColor = 'bg-neutral-100 text-neutral-600';
        let text = result.status || 'Pending';

        if (result.status === 'NotYet') {
          text = t('instructor.finalExam.notStarted');
          bgColor = 'bg-neutral-100 text-neutral-600';
        } else if (result.status === 'Submitted') {
          if (result.isPass === true) {
            bgColor = 'bg-yellow-400 text-black';
            text = t('instructor.finalExam.passed');
          } else if (result.isPass === false) {
            bgColor = 'bg-red-500 text-white';
            text = t('instructor.finalExam.failed');
          } else {
            bgColor = 'bg-neutral-800 text-yellow-400';
          }
        }

        return <span className={`px-3 py-1 text-xs font-bold uppercase ${bgColor}`}>{text}</span>;
      }
    },
    {
      title: t('instructor.finalExam.mark'),
      dataIndex: ['simulationResult', 'marks'],
      key: 'mark',
      width: 100,
      align: 'center',
      render: (score) => score !== null && score !== undefined ? (
        <span className="text-lg font-black text-black">{score.toFixed(2)}</span>
      ) : '-'
    },
  ];

  // Dynamic Task Columns
  tasksMeta.forEach((taskMeta, index) => {
    columns.push({
      title: (
        <Tooltip title={taskMeta.name || taskMeta.code}>
          <div className="text-center font-black uppercase text-xs">
            <span>{t('instructor.finalExam.task')} {index + 1}</span>
          </div>
        </Tooltip>
      ),
      key: `task_${taskMeta.id}`,
      width: 100,
      align: 'center',
      render: (_, record) => {
        const result = record.simulationResult;
        if (!result?.tasks) return <span className="text-neutral-300">-</span>;

        const taskResult = result.tasks.find(t => t.taskCode === taskMeta.code) || result.tasks[index];

        if (!taskResult) return <span className="text-neutral-300">-</span>;

        if (taskResult.isPass) {
          return <CheckCircle className="w-6 h-6 text-yellow-500 mx-auto" />;
        } else {
          if (result.status === 'NotYet') return <span className="text-neutral-300">•</span>;
          return <XCircle className="w-6 h-6 text-red-500 mx-auto" />;
        }
      }
    });
  });

  return (
    <div className={isFullScreen ? "fixed inset-0 z-50 bg-neutral-100 overflow-hidden flex flex-col" : "max-w-[1600px] mx-auto px-4 py-6 bg-neutral-100 min-h-screen"}>

      {/* Header Section */}
      <div className={`flex justify-between items-center mb-6 ${isFullScreen ? 'p-4 border-b-2 border-black bg-white' : ''}`}>
        <div className="flex items-center gap-4">
          {!isFullScreen && (
            <button
              onClick={() => navigate(`/instructor/classes/${classId}/final-exam`)}
              className="w-10 h-10 border-2 border-black bg-white hover:bg-yellow-400 flex items-center justify-center transition-all"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </button>
          )}

          <div>
            <h1 className="text-2xl font-black flex items-center gap-3 m-0 uppercase tracking-tight">
              <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                <Trophy className="w-5 h-5 text-black" />
              </div>
              {t('instructor.finalExam.simulationResults')}
              {practiceInfo && (
                <span className="px-3 py-1 bg-black text-yellow-400 text-sm font-bold uppercase ml-2">
                  {practiceInfo.practiceName}
                </span>
              )}
            </h1>
            {!isFullScreen && practiceInfo && (
              <div className="text-neutral-500 text-sm mt-2 flex gap-3 font-medium">
                <span>{t('instructor.finalExam.code')}: <span className="text-black font-bold">{practiceInfo.practiceCode}</span></span>
                <span className="text-neutral-300">|</span>
                <span>{t('instructor.finalExam.difficulty')}: <span className="text-black font-bold">{practiceInfo.difficultyLevel}</span></span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="h-10 px-4 flex items-center gap-2 border-2 border-black bg-white text-black font-bold uppercase text-sm hover:bg-neutral-100 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {t('instructor.finalExam.refresh')}
          </button>
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={`h-10 px-4 flex items-center gap-2 border-2 border-black font-bold uppercase text-sm transition-all ${isFullScreen
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-yellow-400 text-black hover:bg-yellow-500'
              }`}
          >
            {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            {isFullScreen ? t('instructor.finalExam.exitFullScreen') : t('instructor.finalExam.fullScreen')}
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`flex-1 ${isFullScreen ? 'px-4 pb-4 overflow-hidden' : ''}`}>
        <div className={`bg-white border-2 border-black h-full flex flex-col ${isFullScreen ? '' : ''}`}>
          <div className="h-1 bg-yellow-400" />
          <Table
            columns={columns}
            dataSource={data}
            rowKey="traineeId"
            scroll={{ x: 'max-content', y: isFullScreen ? 'calc(100vh - 180px)' : 600 }}
            loading={loading}
            pagination={isFullScreen ? false : { pageSize: 20, showSizeChanger: true }}
            className="flex-1 [&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:font-bold [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:text-xs [&_.ant-table-thead>tr>th]:tracking-wider [&_.ant-table-thead>tr>th]:border-black [&_.ant-table-tbody>tr>td]:border-neutral-200"
            bordered
            locale={{ emptyText: t('instructor.finalExam.noSimulationData') }}
            size={isFullScreen ? "middle" : "middle"}
          />
        </div>
      </div>
    </div>
  );
}