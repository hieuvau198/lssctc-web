import React, { useEffect, useState } from 'react';
import { Empty, Skeleton, Tooltip, Button, App } from 'antd';
import { useTranslation } from 'react-i18next';
import PracticeTable from './partials/PracticeTable';
import { getPractices } from '../../../apis/Instructor/InstructorPractice';
import { useNavigate } from 'react-router';

// Trang thực hành Instructor chuyển sang phong cách tương tự Course Admin (chỉ bảng)
export default function InstructorPractices() {
  const { t } = useTranslation();
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
      message.error(t('instructor.practices.loadFailed'));
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  // columns/layout handled by PracticeTable partial

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-6 mb-6">
        <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-white/20" />
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Modern Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg p-4 mb-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <span className="text-3xl">🎮</span>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">{t('instructor.practices.title')}</span>
              <p className="text-green-100 text-sm">
                {t('instructor.practices.table.pagination', { start: (pageNumber - 1) * pageSize + 1, end: Math.min(pageNumber * pageSize, total), total })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {(!practices || practices.length === 0) ? (
        <div className="bg-white rounded-xl shadow-lg p-12">
          <Empty 
            description={
              <div>
                <p className="text-gray-600 text-lg font-medium mb-2">{t('instructor.practices.noPractices')}</p>
                <p className="text-gray-400 text-sm">{t('instructor.practices.noPracticesDesc')}</p>
              </div>
            }
            image={<div className="text-8xl mb-4">🎮</div>}
          />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <PracticeTable
            practices={practices}
            pageNumber={pageNumber}
            pageSize={pageSize}
            total={total}
            onPageChange={(p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); }}
            onView={(record) => nav(`/instructor/practices/${record.id}`)}
          />
        </div>
      )}
    </div>
  );
}
