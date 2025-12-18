import React from 'react';
import { Table, Pagination, Tooltip } from 'antd';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const PracticeTable = ({
  practices = [],
  pageNumber = 1,
  pageSize = 10,
  total = 0,
  onPageChange = () => { },
  onView = () => { },
}) => {
  const { t } = useTranslation();

  // Difficulty badge styles
  const getDifficultyStyle = (level) => {
    switch (level) {
      case 'Entry':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Intermediate':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Advanced':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-600 border-neutral-300';
    }
  };

  const tableColumns = [
    {
      title: '#',
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => (
        <span className="font-bold text-neutral-500">
          {(pageNumber - 1) * pageSize + idx + 1}
        </span>
      ),
      fixed: 'left',
    },
    {
      title: t('instructor.practices.table.practiceCode'),
      dataIndex: 'practiceCode',
      key: 'practiceCode',
      width: 140,
      render: (code) => (
        <span className="font-mono text-yellow-600 font-bold">{code}</span>
      ),
    },
    {
      title: t('instructor.practices.table.name'),
      dataIndex: 'practiceName',
      key: 'practiceName',
      width: 260,
      render: (name, record) => (
        <div
          className="font-bold text-black cursor-pointer hover:text-yellow-600 transition-colors"
          onClick={() => onView(record)}
        >
          {name}
        </div>
      ),
    },
    {
      title: t('instructor.practices.table.duration'),
      dataIndex: 'estimatedDurationMinutes',
      key: 'estimatedDurationMinutes',
      width: 130,
      align: 'center',
      render: (v) => (
        <span className="font-medium text-neutral-700">{v}</span>
      ),
    },
    {
      title: t('instructor.practices.table.difficulty'),
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: 140,
      align: 'center',
      render: (level) => (
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getDifficultyStyle(level)}`}>
          {level || t('common.na')}
        </span>
      ),
    },
    {
      title: t('instructor.practices.table.maxAttempts'),
      dataIndex: 'maxAttempts',
      key: 'maxAttempts',
      width: 120,
      align: 'center',
      render: (v) => (
        <span className="font-bold text-neutral-700">{v}</span>
      ),
    },
    {
      title: t('instructor.practices.table.actions'),
      key: 'actions',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Tooltip title={t('instructor.practices.table.viewDetails')}>
          <button
            onClick={() => onView(record)}
            className="w-9 h-9 bg-black border-2 border-black flex items-center justify-center hover:scale-105 transition-transform mx-auto"
          >
            <Eye className="w-4 h-4 text-yellow-400" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white border-2 border-black overflow-hidden relative">
      <div className="h-1 bg-yellow-400 flex-none" />

      {/* Industrial Table Styles */}
      <style>{`
        .industrial-practice-table .ant-table {
          border: 2px solid #000 !important;
        }
        .industrial-practice-table .ant-table-thead > tr > th {
          background: #fef08a !important;
          border-bottom: 2px solid #000 !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          font-size: 12px !important;
          letter-spacing: 0.05em !important;
          color: #000 !important;
        }
        .industrial-practice-table .ant-table-tbody > tr > td {
          border-bottom: 1px solid #e5e5e5 !important;
        }
        .industrial-practice-table .ant-table-tbody > tr:hover > td {
          background: #fef9c3 !important;
        }
        .industrial-practice-table .ant-pagination-item-active {
          background: #facc15 !important;
          border-color: #000 !important;
        }
        .industrial-practice-table .ant-pagination-item-active a {
          color: #000 !important;
          font-weight: 700 !important;
        }
      `}</style>

      <div className="flex-1 overflow-hidden industrial-practice-table p-0">
        <Table
          columns={tableColumns}
          dataSource={practices}
          rowKey="id"
          pagination={false}
          scroll={{ y: "calc(100vh - 350px)" }}
          size="middle"
          className="h-full"
        />
      </div>

      <div className="flex-none p-4 border-t-2 border-neutral-200 bg-white flex justify-center z-10">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          className="industrial-pagination"
          showTotal={(total, range) => (
            <span className="font-bold text-neutral-600 mr-4">
              {range[0]}-{range[1]} / {total} {t('instructor.practices.title').toLowerCase()}
            </span>
          )}
          itemRender={(curr, type, originalElement) => {
            if (type === 'page') {
              return (
                <a className={`font-bold flex items-center justify-center w-full h-full border border-neutral-300 hover:border-yellow-400 hover:text-yellow-600 transition-colors ${curr === pageNumber ? 'bg-yellow-400 text-black border-black' : 'bg-white text-neutral-600'}`}>
                  {curr}
                </a>
              );
            }
            return originalElement;
          }}
        />
        <style>{`
            .industrial-pagination .ant-pagination-item-active {
              border-color: #000 !important;
              background: #facc15 !important;
            }
            .industrial-pagination .ant-pagination-item-active a {
              color: #000 !important;
            }
             .industrial-pagination .ant-pagination-options .ant-select-selector {
               border-radius: 0 !important;
            }
            .industrial-pagination .ant-pagination-item {
               border-radius: 0 !important;
            }
          `}</style>
      </div>
    </div>
  );
};

export default PracticeTable;
