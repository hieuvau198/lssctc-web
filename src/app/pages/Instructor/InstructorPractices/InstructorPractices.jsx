import React, { useEffect, useState } from 'react';
import { Card, Table, Empty, Skeleton, Pagination, Tooltip, Button, message } from 'antd';
import { Eye, Clock, Zap } from 'lucide-react';
import { getPractices } from '../../../apis/Instructor/InstructorPractice';
import { useNavigate } from 'react-router';

export default function InstructorPractices() {
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const nav = useNavigate();

  const load = async (p = page, ps = pageSize) => {
    setLoading(true);
    try {
      const res = await getPractices({ page: p, pageSize: ps });
      setPractices(res.items || []);
      setTotal(res.totalCount || 0);
    } catch (e) {
      console.error('Failed to load practices', e);
      message.error('Failed to load practices');
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const getDifficultyColor = (level) => {
    const colors = { 'Entry': '#22c55e', 'Intermediate': '#f59e0b', 'Advanced': '#ef4444' };
    return colors[level] || '#6b7280';
  };

  const getDifficultyIcon = (level) => {
    if (level === 'Entry') return '⭐';
    if (level === 'Intermediate') return '⭐⭐';
    if (level === 'Advanced') return '⭐⭐⭐';
    return '';
  };

  const columns = [
    { 
      title: '#', 
      key: 'idx', 
      width: 50, 
      align: 'center',
      render: (_, __, idx) => (page - 1) * pageSize + idx + 1 
    },
    { 
      title: 'Practice Name', 
      dataIndex: 'practiceName', 
      key: 'practiceName',
      render: (text, record) => (
        <div>
          <div className="font-semibold text-gray-900">{text}</div>
          <div className="text-sm text-gray-500">{record.practiceCode}</div>
        </div>
      )
    },
    { 
      title: 'Duration', 
      dataIndex: 'estimatedDurationMinutes', 
      key: 'duration', 
      width: 120,
      align: 'center',
      render: (min) => (
        <div className="flex items-center justify-center gap-1">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>{min} min</span>
        </div>
      )
    },
    { 
      title: 'Difficulty', 
      dataIndex: 'difficultyLevel', 
      key: 'difficulty', 
      width: 150,
      align: 'center',
      render: (level) => (
        <div className="flex items-center justify-center gap-1">
          <span 
            className="px-3 py-1 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: getDifficultyColor(level) }}
          >
            {level}
          </span>
          <span className="text-lg">{getDifficultyIcon(level)}</span>
        </div>
      )
    },
    { 
      title: 'Max Attempts', 
      dataIndex: 'maxAttempts', 
      key: 'maxAttempts', 
      width: 120,
      align: 'center',
      render: (attempts) => (
        <div className="flex items-center justify-center gap-1">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>{attempts}</span>
        </div>
      )
    },
    {
      title: 'Status', 
      dataIndex: 'isActive', 
      key: 'status', 
      width: 100,
      align: 'center',
      render: (isActive) => (
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          isActive 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      title: 'Actions', 
      key: 'actions', 
      width: 80, 
      fixed: 'right', 
      align: 'center',
      render: (_, record) => (
        <Tooltip title="View Details">
          <Button 
            type="primary" 
            size="small" 
            icon={<Eye className="w-4 h-4" />} 
            onClick={() => nav(`/instructor/practices/${record.id}`)}
            className="hover:scale-110 transition-transform"
          />
        </Tooltip>
      )
    }
  ];

  if (loading) return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 px-0">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">Practices Management</h1>
        <p className="text-blue-100 mt-2">View and manage all teaching practices</p>
      </div>
      <div className="px-6 py-4">
        <Card>
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    </div>
  );

  if (!practices || practices.length === 0) return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 px-0">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">Practices Management</h1>
        <p className="text-blue-100 mt-2">View and manage all teaching practices</p>
      </div>
      <div className="px-6 py-4">
        <Card title="Practices">
          <Empty description="No practices found." />
        </Card>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 px-0">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-8">
        <h1 className="text-3xl font-bold">Practices Management</h1>
        <p className="text-blue-100 mt-2">View and manage all teaching practices</p>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <Card className="shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <Table 
              columns={columns} 
              dataSource={practices} 
              rowKey="id" 
              pagination={false} 
              size="middle"
              className="bg-white"
              rowClassName="hover:bg-blue-50 transition-colors"
            />
          </div>
          
          {/* Pagination */}
          <div className="pt-6 border-t border-gray-200 flex justify-center items-center">
            <Pagination 
              current={page} 
              pageSize={pageSize} 
              total={total} 
              showSizeChanger 
              pageSizeOptions={["10", "20", "50"]}
              onChange={(p, ps) => { setPage(p); setPageSize(ps); load(p, ps); }} 
              showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} practices`}
              className="py-2"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
