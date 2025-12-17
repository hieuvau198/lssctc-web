import React, { useEffect, useState } from 'react';
import { Empty, Skeleton, App } from 'antd';
import { useTranslation } from 'react-i18next';
import { Settings, AlertCircle } from 'lucide-react';
import PracticeTable from './partials/PracticeTable';
import { getPractices } from '../../../apis/Instructor/InstructorPractice';
import { useNavigate } from 'react-router';

// Trang thực hành Instructor - Industrial Theme (đồng bộ MY CLASSES)
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

  // Loading State - Industrial Theme
  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
      <div className="bg-black border-2 border-black p-6 mb-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
        <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-neutral-800" />
      </div>
      <div className="bg-white border-2 border-black p-6">
        <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
      {/* Header - Industrial Theme (matching MY CLASSES) */}
      <div className="bg-black border-2 border-black p-5 mb-6">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Settings className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('instructor.practices.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {t('instructor.practices.table.pagination', {
                  start: (pageNumber - 1) * pageSize + 1,
                  end: Math.min(pageNumber * pageSize, total),
                  total
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {(!practices || practices.length === 0) ? (
        <div className="bg-white border-2 border-black p-12">
          <div className="h-1 bg-yellow-400 -mx-12 -mt-12 mb-8" />
          <Empty
            description={
              <div>
                <p className="text-neutral-800 text-lg font-bold uppercase mb-2">
                  {t('instructor.practices.noPractices')}
                </p>
                <p className="text-neutral-500 text-sm">
                  {t('instructor.practices.noPracticesDesc')}
                </p>
              </div>
            }
            image={
              <div className="w-20 h-20 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mx-auto mb-4">
                <Settings className="w-10 h-10 text-neutral-400" />
              </div>
            }
          />
        </div>
      ) : (
        <PracticeTable
          practices={practices}
          pageNumber={pageNumber}
          pageSize={pageSize}
          total={total}
          onPageChange={(p, ps) => { setPageNumber(p); setPageSize(ps); load(p, ps); }}
          onView={(record) => nav(`/instructor/practices/${record.id}`)}
        />
      )}
    </div>
  );
}
