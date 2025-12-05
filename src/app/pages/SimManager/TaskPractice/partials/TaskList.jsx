import React from 'react';
import { Pagination, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import TaskCard from '../../../../components/TaskCard/TaskCard';

export default function TaskList({
  data = [],
  loading = false,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
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
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center py-4">
        <Pagination
          current={pagination.current}
          pageSize={pagination.pageSize}
          total={pagination.total}
          onChange={pagination.onChange}
          showSizeChanger
          pageSizeOptions={['9', '10', '20', '50']}
          showTotal={(total, range) => t('simManager.tasks.pagination', { start: range[0], end: range[1], total })}
        />
      </div>
    </div>
  );
}
