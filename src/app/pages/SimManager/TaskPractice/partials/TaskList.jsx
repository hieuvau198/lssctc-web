import React from 'react';
import { Pagination, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import TaskCard from '../../../../components/TaskCard/TaskCard';

export default function TaskList({
  data = [],
  loading = false,
  onView = () => { },
  onEdit = () => { },
  onDelete = () => { },
  pagination = {},
}) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((task, idx) => (
          <TaskCard
            key={task.id}
            task={task}
            index={idx}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            color="violet"
          />
        ))}
      </div>

      <div className="flex justify-center py-4 border-t-2 border-neutral-200 bg-white">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onChange}
          showSizeChanger
          pageSizeOptions={['9', '10', '20', '50']}
          className="industrial-pagination"
          showTotal={(total, range) => (
            <span className="font-bold text-neutral-600 mr-4">
              {range[0]}-{range[1]} / {total} {t('simManager.tasks.title').toLowerCase()}
            </span>
          )}
          itemRender={(curr, type, originalElement) => {
            if (type === 'page') {
              return (
                <a className={`font-bold flex items-center justify-center w-full h-full border border-neutral-300 hover:border-yellow-400 hover:text-yellow-600 transition-colors ${curr === pagination.current ? 'bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : 'bg-white text-neutral-600 hover:shadow-[2px_2px_0px_0px_rgba(250,204,21,1)]'}`}>
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
            background: transparent !important;
          }
          .industrial-pagination .ant-pagination-item-active a {
            color: #000 !important;
          }
           .industrial-pagination .ant-pagination-options .ant-select-selector {
             border-radius: 0 !important;
             border: 1px solid #d4d4d4 !important;
          }
          .industrial-pagination .ant-pagination-item {
             border-radius: 0 !important;
             border: none !important;
          }
          .industrial-pagination .ant-pagination-prev .ant-pagination-item-link,
          .industrial-pagination .ant-pagination-next .ant-pagination-item-link {
             border-radius: 0 !important;
             border: 1px solid #d4d4d4 !important;
          }
        `}</style>
      </div>
    </div>
  );
}
