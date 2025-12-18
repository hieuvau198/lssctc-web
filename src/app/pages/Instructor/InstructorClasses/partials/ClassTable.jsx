import React from 'react';
import { Table, Pagination, Tooltip } from 'antd';
import { Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import getClassStatus from '../../../../utils/classStatus';

const ClassTable = ({
  classes = [],
  pageNumber = 1,
  pageSize = 10,
  total = 0,
  onPageChange = () => { },
  onView = () => { },
}) => {
  const { t } = useTranslation();

  // Status color mapping for Light Wire theme
  const getStatusStyle = (status) => {
    const statusMap = {
      'Draft': 'bg-neutral-100 text-neutral-600 border-neutral-300',
      'Open': 'bg-yellow-100 text-yellow-700 border-yellow-400',
      'Inprogress': 'bg-yellow-400 text-black border-black',
      'Completed': 'bg-black text-yellow-400 border-black',
      'Cancelled': 'bg-red-100 text-red-700 border-red-400',
    };
    return statusMap[status] || 'bg-neutral-100 text-neutral-600 border-neutral-300';
  };

  const tableColumns = [
    {
      title: <span className="font-black uppercase text-xs">#</span>,
      key: 'index',
      width: 64,
      align: 'center',
      render: (_, __, idx) => <span className="font-bold text-neutral-600">{(pageNumber - 1) * pageSize + idx + 1}</span>,
      fixed: 'left',
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.table.classCode')}</span>,
      dataIndex: 'classCode',
      key: 'classCode',
      width: 100,
      fixed: 'left',
      render: (code) => <span className="font-mono font-bold text-yellow-600">{code}</span>,
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.table.name')}</span>,
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (name, record) => (
        <button
          className="font-bold text-black hover:text-yellow-600 text-left transition-colors"
          onClick={() => onView(record)}
        >
          {name || record.className || t('common.na')}
        </button>
      ),
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.table.startDate')}</span>,
      dataIndex: 'startDate',
      key: 'startDate',
      width: 120,
      render: (date) => <span className="text-neutral-600 font-medium">{date ? new Date(date).toLocaleDateString() : '-'}</span>,
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.table.endDate')}</span>,
      dataIndex: 'endDate',
      key: 'endDate',
      width: 120,
      render: (date) => <span className="text-neutral-600 font-medium">{date ? new Date(date).toLocaleDateString() : '-'}</span>,
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.table.trainees')}</span>,
      dataIndex: 'traineeCount',
      key: 'traineeCount',
      width: 100,
      align: 'center',
      render: (count) => <span className="font-black text-black">{count ?? 0}</span>,
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.table.status')}</span>,
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'center',
      render: (status) => {
        const s = getClassStatus(status);
        return (
          <span className={`px-2 py-1 text-xs font-bold uppercase border ${getStatusStyle(status)}`}>
            {s.label || t('common.na')}
          </span>
        );
      },
    },
    {
      title: <span className="font-black uppercase text-xs">{t('instructor.classes.table.actions')}</span>,
      key: 'actions',
      width: 100,
      fixed: 'right',
      align: 'center',
      render: (_, record) => (
        <Tooltip title={t('instructor.classes.table.viewDetails')}>
          <button
            onClick={() => onView(record)}
            className="w-8 h-8 border-2 border-black bg-white hover:bg-yellow-400 flex items-center justify-center transition-all mx-auto"
          >
            <Eye className="w-4 h-4 text-black" />
          </button>
        </Tooltip>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col bg-white border-2 border-black overflow-hidden relative">
      <div className="h-1 bg-yellow-400 flex-none" />
      <div className="flex-1 overflow-hidden p-0">
        <Table
          columns={tableColumns}
          dataSource={classes}
          rowKey={(r) => r.id || r.classId}
          pagination={false}
          scroll={{ y: "calc(100vh - 350px)" }} // Adjusted for header heights
          size="middle"
          className="h-full [&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-neutral-700 [&_.ant-table-tbody>tr>td]:border-neutral-200"
        />
      </div>

      <div className="flex-none p-4 border-t-2 border-black bg-neutral-50 flex justify-center z-10">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={onPageChange}
          showSizeChanger
          pageSizeOptions={["10", "20", "50"]}
          className="industrial-pagination"
          showTotal={(t, r) => <span className="font-bold text-neutral-600 mr-4">{r[0]}-{r[1]} / {t}</span>}
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

export default ClassTable;
