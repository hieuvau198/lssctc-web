import React from 'react';
import { Pagination, Spin } from 'antd';
import TaskCard from '../../../../components/TaskCard/TaskCard';

export default function TaskList({
  data = [],
  loading = false,
  onView = () => {},
  onEdit = () => {},
  onDelete = () => {},
  pagination = {},
}) {
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
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} tasks`}
        />
      </div>
    </div>
  );
}
