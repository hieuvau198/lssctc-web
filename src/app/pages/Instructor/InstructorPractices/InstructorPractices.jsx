import React, { useEffect, useState } from 'react';
import { Empty, Skeleton, Tooltip, Button, App } from 'antd';
import PracticeTable from './partials/PracticeTable';
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

  // columns/layout handled by PracticeTable partial

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
        <span className="text-2xl">Practices</span>
      </div>

      {/* Content */}
      {(!practices || practices.length === 0) ? (
        <Empty description="Không có practice" className="mt-16" />
      ) : (
        <div className="bg-white rounded-lg shadow">
          {/* fixed-height container so page doesn't grow; table body will scroll */}
          <div className="overflow-hidden">
            <PracticeTable
              practices={practices}
              pageNumber={pageNumber}
              pageSize={pageSize}
              total={total}
              onPageChange={(p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); }}
              onView={(record) => nav(`/instructor/practices/${record.id}`)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
