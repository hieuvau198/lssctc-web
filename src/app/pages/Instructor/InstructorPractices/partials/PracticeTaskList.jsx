import React, { useEffect, useState, useCallback } from 'react';
import { Card, message, Empty, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { getTasksByPracticeId } from '../../../../apis/Instructor/InstructorPractice';
import TaskCard from '../../../../components/TaskCard/TaskCard';

// --- Main PracticeTaskList Component ---
export default function PracticeTaskList({ practiceId, token }) {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = useCallback(async () => {
    if (!practiceId || !token) return;

    setLoading(true);
    try {
      const data = await getTasksByPracticeId(practiceId, token);
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      message.error(t('instructor.practices.manageTasks.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [practiceId, token, t]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // --- Render ---
  if (loading) {
    return (
      <Card title={t('instructor.practices.practiceTasks')} className="shadow">
        <div className="flex justify-center py-8">
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={t('instructor.practices.practiceTasksWithCount', { count: tasks.length })}
      className="shadow"
    >
      {tasks.length === 0 ? (
        <Empty description={t('instructor.practices.tasks.noTasksAssigned')} />
      ) : (
        <div className="max-h-[600px] overflow-y-auto pr-2">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-min">
            {tasks.map((task, idx) => (
              <TaskCard
                key={task.id}
                task={task}
                index={idx}
              />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
