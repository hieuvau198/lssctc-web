import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Card, Button, Tag, Avatar, Tooltip, App, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, TrophyOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import InstructorFEApi from '../../../apis/Instructor/InstructorFEApi';

export default function ClassSimulationResults() {
  const { t } = useTranslation();
  const { classId } = useParams();
  const navigate = useNavigate();
  const { message } = App.useApp();
  
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [tasksMeta, setTasksMeta] = useState([]); // Lưu thông tin các cột Task
  const [practiceInfo, setPracticeInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, [classId]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await InstructorFEApi.getClassSimulationResults(classId);
      const results = res.data || [];
      setData(results);

      // Tìm một bài làm mẫu đã hoàn thành (hoặc có dữ liệu) để lấy cấu trúc Task tạo cột
      // Ưu tiên lấy từ học viên đã có simulationResult
      const sampleSubmission = results.find(r => r.simulationResult?.practiceAttempt?.tasks?.length > 0);
      
      if (sampleSubmission) {
        const tasks = sampleSubmission.simulationResult.practiceAttempt.tasks;
        // Sort tasks theo thứ tự nếu cần (ví dụ theo stepId hoặc id)
        const sortedTasks = [...tasks].sort((a, b) => a.id - b.id);
        setTasksMeta(sortedTasks.map(t => ({
          code: t.taskCode, // Giả sử backend trả về taskCode hoặc name trong object task
          name: t.note || `Task ${t.id}` // Fallback name
        })));
        setPracticeInfo(sampleSubmission.simulationResult.practiceInfo);
      }
    } catch (error) {
      console.error(error);
      message.error('Failed to load simulation results');
    } finally {
      setLoading(false);
    }
  };

  // Định nghĩa cột cho bảng
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
      title: 'Overall Status',
      key: 'status',
      width: 150,
      render: (_, record) => {
        const result = record.simulationResult;
        if (!result) return <Tag>Not Started</Tag>;
        
        let color = 'default';
        let text = result.status || 'Pending';
        
        if (result.isPass === true) { color = 'success'; text = 'PASSED'; }
        else if (result.isPass === false) { color = 'error'; text = 'FAILED'; }
        else if (result.status === 'Submitted') { color = 'blue'; }

        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Total Score',
      dataIndex: ['simulationResult', 'marks'],
      key: 'score',
      width: 120,
      align: 'center',
      render: (score) => score !== null && score !== undefined ? <span className="font-bold text-blue-600">{score.toFixed(2)}</span> : '-'
    },
  ];

  // Thêm các cột động cho từng Task
  if (tasksMeta.length > 0) {
    tasksMeta.forEach((task, index) => {
      columns.push({
        title: (
          <Tooltip title={task.name || task.code}>
            <span>Task {index + 1}</span>
            <div className="text-xs text-gray-400 font-normal truncate max-w-[100px]">{task.code}</div>
          </Tooltip>
        ),
        key: `task_${index}`,
        width: 120,
        align: 'center',
        render: (_, record) => {
          const result = record.simulationResult;
          if (!result?.practiceAttempt?.tasks) return <span className="text-gray-300">-</span>;

          // Tìm task tương ứng trong bài làm của học viên này (khớp theo Code hoặc Index)
          // Giả sử thứ tự task giống nhau cho mọi đề cùng PracticeId
          const taskResult = result.practiceAttempt.tasks[index]; 
          
          if (!taskResult) return <span className="text-gray-300">-</span>;

          if (taskResult.isPass) {
             return <CheckCircleOutlined className="text-green-500 text-lg" />;
          } else if (taskResult.isPass === false) {
             return <CloseCircleOutlined className="text-red-500 text-lg" />;
          }
          return <Tag>Pending</Tag>;
        }
      });
    });
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Breadcrumb & Navigation */}
      <div className="mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          type="text" 
          onClick={() => navigate(`/instructor/classes/${classId}/final-exam`)}
          className="mb-2 pl-0 hover:bg-transparent hover:text-blue-600"
        >
          Back to Exam Config
        </Button>
        <div className="flex items-center justify-between">
           <div>
             <h1 className="text-2xl font-bold flex items-center gap-2">
               <TrophyOutlined className="text-yellow-500" />
               Simulation Exam Results
             </h1>
             {practiceInfo && (
               <p className="text-gray-500 mt-1">
                 Practice: <span className="font-medium text-gray-700">{practiceInfo.practiceName}</span> 
                 <span className="mx-2">•</span> 
                 Difficulty: <Tag color="blue">{practiceInfo.difficultyLevel}</Tag>
               </p>
             )}
           </div>
           <Button type="primary" onClick={fetchData}>Refresh Data</Button>
        </div>
      </div>

      <Card className="shadow-md rounded-xl border-gray-100" bodyStyle={{ padding: 0 }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          rowKey="traineeId"
          scroll={{ x: 1000 }}
          loading={loading}
          pagination={{ pageSize: 20 }}
          locale={{ emptyText: 'No simulation data found for this class' }}
        />
      </Card>
    </div>
  );
}