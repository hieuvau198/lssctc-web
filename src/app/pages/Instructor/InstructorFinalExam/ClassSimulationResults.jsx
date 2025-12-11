// src/app/pages/Instructor/InstructorFinalExam/ClassSimulationResults.jsx
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Card, Button, Tag, Avatar, Tooltip, App } from 'antd';
import { 
  ArrowLeftOutlined, 
  TrophyOutlined, 
  CheckCircleFilled, 
  CloseCircleFilled, 
  UserOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
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
      message.error('Failed to load simulation results');
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
      title: 'Trainee',
      key: 'trainee',
      fixed: 'left',
      width: 250,
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <Avatar src={record.avatarUrl} icon={<UserOutlined />} />
          <div className="flex flex-col">
            <span className="font-medium">{record.traineeName}</span>
            <span className="text-gray-500 text-xs">{record.traineeCode}</span>
          </div>
        </div>
      )
    },
    {
      title: 'Start Time',
      dataIndex: ['simulationResult', 'startTime'],
      key: 'startTime',
      width: 160,
      render: (text) => <span className="text-gray-600 text-sm">{formatDate(text)}</span>
    },
    {
      title: 'Complete Time',
      dataIndex: ['simulationResult', 'completeTime'],
      key: 'completeTime',
      width: 160,
      render: (text) => <span className="text-gray-600 text-sm">{formatDate(text)}</span>
    },
    {
      title: 'Status',
      key: 'status',
      width: 140,
      render: (_, record) => {
        const result = record.simulationResult;
        if (!result) return <Tag>No Data</Tag>;
        
        let color = 'default';
        let text = result.status || 'Pending'; // Default from API might be "NotYet"
        
        // Mapping status from API response
        if (result.status === 'NotYet') {
            text = 'Not Started';
            color = 'default';
        } else if (result.status === 'Submitted') {
             // Check pass/fail logic if submitted
            if (result.isPass === true) { 
                color = 'success'; 
                text = 'PASSED'; 
            } else if (result.isPass === false) { 
                color = 'error'; 
                text = 'FAILED'; 
            } else {
                color = 'processing';
            }
        }
        
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Mark',
      dataIndex: ['simulationResult', 'marks'],
      key: 'mark',
      width: 100,
      align: 'center',
      render: (score) => score !== null && score !== undefined ? (
        <span className=" text-base">{score.toFixed(2)}</span>
      ) : '-'
    },
  ];

  // Dynamic Task Columns
  tasksMeta.forEach((taskMeta, index) => {
    columns.push({
      title: (
        <Tooltip title={taskMeta.name || taskMeta.code}>
          <div className="text-center">
            <span>Task {index + 1}</span>
          </div>
        </Tooltip>
      ),
      key: `task_${taskMeta.id}`,
      width: 100,
      align: 'center',
      render: (_, record) => {
        const result = record.simulationResult;
        if (!result?.tasks) return <span className="text-gray-300">-</span>;

        // Find the specific task in this trainee's result
        // We match by taskCode or id if possible, otherwise index
        const taskResult = result.tasks.find(t => t.taskCode === taskMeta.code) || result.tasks[index];
        
        if (!taskResult) return <span className="text-gray-300">-</span>;

        if (taskResult.isPass) {
           return <CheckCircleFilled className="text-green-500 text-xl" />;
        } else {
           // If not passed, check if it was attempted (duration > 0 or has data) or just pending
           // Based on JSON, even 'NotYet' status has isPass: false.
           // You might want to check result.status to decide if it's a "Fail" or "Not Attempted"
           if (result.status === 'NotYet') return <span className="text-gray-300">•</span>;
           return <CloseCircleFilled className="text-red-500 text-xl" />;
        }
      }
    });
  });

  return (
    <div className={isFullScreen ? "fixed inset-0 z-50 bg-white overflow-hidden flex flex-col" : "max-w-[1600px] mx-auto px-4 py-4"}>
      
      {/* Header Section */}
      <div className={`flex justify-between items-center mb-4 ${isFullScreen ? 'p-4 border-b shadow-sm bg-gray-50' : ''}`}>
        <div className="flex items-center gap-4">
          {!isFullScreen && (
            <Button 
              icon={<ArrowLeftOutlined />} 
              type="text" 
              onClick={() => navigate(`/instructor/classes/${classId}/final-exam`)}
              className="hover:bg-gray-100"
            />
          )}
          
          <div>
             <h1 className="text-xl font-bold flex items-center gap-2 m-0">
               <TrophyOutlined className="text-yellow-500" />
               Simulation Results
               {practiceInfo && <Tag color="blue" className="ml-2 font-normal">{practiceInfo.practiceName}</Tag>}
             </h1>
             {!isFullScreen && practiceInfo && (
               <div className="text-gray-500 text-sm mt-1 flex gap-2">
                 <span>Code: {practiceInfo.practiceCode}</span>
                 <span>•</span>
                 <span>Difficulty: {practiceInfo.difficultyLevel}</span>
               </div>
             )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={fetchData} loading={loading}>Refresh</Button>
          <Button 
            type={isFullScreen ? "default" : "primary"}
            icon={isFullScreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={isFullScreen ? "bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:border-red-300" : ""}
          >
            {isFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className={`flex-1 ${isFullScreen ? 'p-4 overflow-hidden' : ''}`}>
        <Card 
          className={`shadow-md rounded-xl border-gray-100 h-full flex flex-col ${isFullScreen ? 'shadow-none border-0' : ''}`} 
          bodyStyle={{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }}
        >
          <Table 
            columns={columns} 
            dataSource={data} 
            rowKey="traineeId"
            scroll={{ x: 'max-content', y: isFullScreen ? 'calc(100vh - 140px)' : 600 }}
            loading={loading}
            pagination={isFullScreen ? false : { pageSize: 20, showSizeChanger: true }}
            className="flex-1"
            bordered
            locale={{ emptyText: 'No simulation data found' }}
            size={isFullScreen ? "medium" : "middle"}
          />
        </Card>
      </div>
    </div>
  );
}