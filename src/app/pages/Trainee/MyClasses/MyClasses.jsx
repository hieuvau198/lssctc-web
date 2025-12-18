import { Empty, Spin, Table, Pagination } from 'antd';
import { BookOpen, Calendar, Clock, ChevronRight, GraduationCap } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getLearningClassesByTraineeId } from '../../../apis/Trainee/TraineeClassApi';
import PageNav from '../../../components/PageNav/PageNav';
import { getAuthToken } from '../../../libs/cookies';
import { decodeToken } from '../../../libs/jwtDecode';
import useAuthStore from '../../../store/authStore';
import { getClassStatus } from '../../../utils/classStatus';


export default function MyClasses() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => (
        <span className="font-bold text-neutral-500">
          {(page - 1) * pageSize + idx + 1}
        </span>
      ),
      fixed: 'left',
    },
    {
      title: t('trainee.myLearning.classCode') || 'MÃ LỚP',
      dataIndex: 'classCode',
      key: 'classCode',
      width: 120,
      render: (text) => (
        <span className="font-mono text-yellow-600 font-bold">{text}</span>
      ),
    },
    {
      title: t('trainee.myLearning.className') || 'TÊN LỚP',
      dataIndex: 'name',
      key: 'name',
      minWidth: 200,
      render: (text, record) => (
        <Link to={`/my-classes/${record.id}`} className="font-bold text-black hover:text-yellow-600 transition-colors uppercase block">
          {text}
        </Link>
      )
    },
    {
      title: t('trainee.startDate'),
      dataIndex: 'startDate',
      key: 'startDate',
      width: 140,
      render: (date) => <span className="font-medium text-neutral-700">{new Date(date).toLocaleDateString('vi-VN')}</span>
    },
    {
      title: t('trainee.endDate'),
      dataIndex: 'endDate',
      key: 'endDate',
      width: 140,
      render: (date) => <span className="font-medium text-neutral-700">{new Date(date).toLocaleDateString('vi-VN')}</span>
    },
    {
      title: t('trainee.duration'),
      dataIndex: 'durationHours',
      key: 'durationHours',
      width: 120,
      align: 'center',
      render: (v) => <span className="font-bold text-neutral-900">{v}h</span>
    },
    {
      title: t('trainee.status'),
      dataIndex: '_statusMapped',
      key: 'status',
      width: 140,
      align: 'center',
      render: (status) => {
        const s = getClassStatus(status);
        return (
          <span className={`px-2 py-1 text-xs font-bold uppercase border ${s.color === 'green' ? 'bg-yellow-400 text-black border-black' : 'bg-neutral-100 text-neutral-600 border-neutral-300'}`}>
            {s.label}
          </span>
        );
      }
    },
    {
      title: t('trainee.action') || 'THAO TÁC',
      key: 'action',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Link to={`/my-classes/${record.id}`}>
          <button className="w-9 h-9 bg-black border-2 border-black flex items-center justify-center hover:scale-105 transition-transform mx-auto">
            <ChevronRight className="w-5 h-5 text-yellow-400" />
          </button>
        </Link>
      ),
    },
  ];

  // Filter programs based on tab
  // (already done in useEffect, but we need to paginate the 'programs' state for the table if not fetching paginated API)
  // The API getLearningClassesByTraineeId returns all classes. We do client-side pagination here for the table.
  const paginatedData = programs.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col p-6 bg-neutral-100 overflow-hidden">
      {/* Header - Industrial Theme */}
      <div className="flex-none bg-black border-2 border-black p-5 mb-4">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {t('trainee.myLearning.title')}
              </h1>
              <p className="text-yellow-400 text-sm mt-1 font-medium">
                {programs.length} {tab === 'in-progress' ? t('trainee.inProgress') : t('trainee.completed').toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Card - Table */}
      <div className="flex-1 flex flex-col bg-white border-2 border-black overflow-hidden relative industrial-table">
        <div className="h-1 bg-yellow-400 flex-none" />

        <style>{`
          .industrial-table .ant-table {
            border: 2px solid #000 !important;
            border-top: none !important; /* Visual tweak if needed, but standard 2px is fine */
          }
          .industrial-table .ant-table-container {
             border-left: 2px solid #000 !important;
             border-right: 2px solid #000 !important;
             border-bottom: 2px solid #000 !important;
          }
           /* Override specific border for new layout */
          .industrial-table .ant-table {
            border: none !important;
          }

          .industrial-table .ant-table-thead > tr > th {
            background: #fef08a !important;
            border-bottom: 2px solid #000 !important;
            font-weight: 700 !important;
            text-transform: uppercase !important;
            font-size: 12px !important;
            letter-spacing: 0.05em !important;
            color: #000 !important;
            border-right: 1px solid rgba(0,0,0,0.05) !important;
          }
          .industrial-table .ant-table-tbody > tr > td {
            border-bottom: 1px solid #e5e5e5 !important;
            border-right: 1px solid #f0f0f0 !important;
          }
          .industrial-table .ant-table-tbody > tr:hover > td {
            background: #fef9c3 !important;
          }
          .industrial-table .ant-pagination-item-active {
            background: #facc15 !important;
            border-color: #000 !important;
          }
          .industrial-table .ant-pagination-item-active a {
            color: #000 !important;
            font-weight: 700 !important;
          }
        `}</style>

        <div className="flex-1 overflow-hidden p-6 pb-2">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center">
              <Spin size="large" />
              <p className="mt-4 font-bold uppercase text-neutral-500">{t('common.loading')}</p>
            </div>
          ) : programs.length === 0 ? (
            <Empty
              description={
                <span className="font-bold text-neutral-500 uppercase">
                  {t('trainee.myLearning.noClasses')}
                </span>
              }
              className="py-20"
            />
          ) : (
            <Table
              columns={columns}
              dataSource={paginatedData}
              rowKey="id"
              pagination={false}
              scroll={{ y: "calc(100vh - 380px)" }}
              size="middle"
              className="border-2 border-black"
            />
          )}
        </div>

        {/* Pagination */}
        {!loading && programs.length > 0 && (
          <div className="flex-none p-4 border-t-2 border-neutral-200 flex justify-center bg-white z-10">
            <div className="flex items-center gap-4">
              <span className="text-sm font-bold text-neutral-500">
                {programs.length} {t('trainee.myLearning.title').toLowerCase()}
              </span>
              {/* Custom Pagination if needed, or just info */}
              {/* Since we do client side pagination for now on this page */}
              <div className="flex gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 border border-neutral-300 disabled:opacity-30 hover:bg-neutral-100 font-bold"
                >
                  &lt;
                </button>
                <span className="px-3 py-1 bg-yellow-400 border border-black font-bold text-black">
                  {page}
                </span>
                <button
                  disabled={page * pageSize >= programs.length}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 border border-neutral-300 disabled:opacity-30 hover:bg-neutral-100 font-bold"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
