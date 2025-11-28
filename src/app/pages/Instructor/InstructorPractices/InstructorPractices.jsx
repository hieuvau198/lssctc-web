import React, { useEffect, useState } from 'react';
import { Table, Empty, Skeleton, Tooltip, Button, App } from 'antd';
import { Eye, Clock, Zap } from 'lucide-react';
import { getPractices } from '../../../apis/Instructor/InstructorPractice';
import { useNavigate } from 'react-router';

// Trang thực hành Instructor chuyển sang phong cách tương tự Course Admin (chỉ bảng)
export default function InstructorPractices() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const nav = useNavigate();

  const load = async (p = pageNumber, ps = pageSize) => {
    setLoading(true);
    try {
      const res = await getPractices({ page: p, pageSize: ps });
      setPractices(res.items || []);
      setTotal(res.totalCount || 0);
    } catch (e) {
      console.error('Failed to load practices', e);
      message.error('Load practices thất bại');
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const difficultyBadge = (level) => {
    const map = {
      Entry: { cls: 'bg-green-100 text-green-700', stars: '⭐' },
      Intermediate: { cls: 'bg-amber-100 text-amber-700', stars: '⭐⭐' },
      Advanced: { cls: 'bg-red-100 text-red-700', stars: '⭐⭐⭐' },
    };
    const d = map[level] || { cls: 'bg-slate-100 text-slate-600', stars: '' };
    return (
      <div className="flex items-center justify-center gap-1">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.cls}`}>{level}</span>
        <span className="text-sm leading-none">{d.stars}</span>
      </div>
    );
  };

  const columns = [
    {
      title: '#',
      key: 'idx',
      width: 60,
      align: 'center',
      render: (_, __, idx) => (pageNumber - 1) * pageSize + idx + 1,
    },
    {
      title: 'Practice Name',
      dataIndex: 'practiceName',
      key: 'practiceName',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium text-slate-800">{text}</span>
          <span className="text-xs text-slate-500">{record.practiceCode}</span>
        </div>
      ),
    },
    {
      title: 'Duration',
      dataIndex: 'estimatedDurationMinutes',
      key: 'duration',
      width: 120,
      align: 'center',
      render: (min) => (
        <div className="flex items-center justify-center gap-1 text-slate-700">
          <Clock className="w-4 h-4 text-blue-500" />
          <span>{min} min</span>
        </div>
      ),
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: 140,
      align: 'center',
      render: difficultyBadge,
    },
    {
      title: 'Max Attempts',
      dataIndex: 'maxAttempts',
      key: 'maxAttempts',
      width: 120,
      align: 'center',
      render: (v) => (
        <div className="flex items-center justify-center gap-1 text-slate-700">
          <Zap className="w-4 h-4 text-yellow-500" />
          <span>{v}</span>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 110,
      align: 'center',
      render: (isActive) => (
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>{isActive ? 'Active' : 'Inactive'}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 90,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Tooltip title="Xem chi tiết">
          <Button
            type="primary"
            size="small"
            icon={<Eye className="w-4 h-4" />}
            onClick={() => nav(`/instructor/practices/${record.id}`)}
          />
        </Tooltip>
      ),
    },
  ];

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <Skeleton.Button style={{ width: 200, height: 32 }} active />
      </div>
      <div className="bg-white rounded-lg shadow p-4">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-2xl">Practice Management</span>
      </div>

      {/* Content */}
      {(!practices || practices.length === 0) ? (
        <Empty description="Không có practice" className="mt-16" />
      ) : (
        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            dataSource={practices}
            rowKey="id"
            size="middle"
            pagination={{
              current: pageNumber,
              pageSize,
              total,
              showSizeChanger: true,
              pageSizeOptions: ['10','20','50'],
              onChange: (p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); },
              showTotal: (t) => `${t} practices`,
            }}
            className="overflow-x-auto"
            rowClassName="hover:bg-blue-50 transition-colors"
          />
        </div>
      )}
    </div>
  );
}
