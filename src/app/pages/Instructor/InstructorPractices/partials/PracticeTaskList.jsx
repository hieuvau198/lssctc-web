import React, { useEffect, useState, useCallback } from 'react';
import { Empty, Skeleton } from 'antd';
import { useTranslation } from 'react-i18next';
import { getTasksByPracticeId } from '../../../../apis/Instructor/InstructorPractice';
import TaskCard from '../../../../components/TaskCard/TaskCard';
import { ListTodo } from 'lucide-react';

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
    } finally {
      setLoading(false);
    }
  }, [practiceId, token]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Loading State
  if (loading) {
    return (
      <div className="bg-white border-2 border-black overflow-hidden">
        <div className="h-1 bg-yellow-400" />
        <div className="px-6 py-4 border-b-2 border-neutral-200 bg-neutral-50">
          <div className="flex items-center gap-2">
            <ListTodo className="w-5 h-5" />
            <span className="font-black text-black uppercase tracking-tight">
              {t('instructor.practices.practiceTasks')}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-center py-8">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black overflow-hidden">
      <div className="h-1 bg-yellow-400" />

      {/* Header */}
      <div className="px-6 py-4 border-b-2 border-neutral-200 bg-neutral-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
            <ListTodo className="w-5 h-5 text-black" />
          </div>
          <div>
            <h2 className="font-black text-black uppercase tracking-tight">
              {t('instructor.practices.practiceTasks')}
            </h2>
            <p className="text-sm text-neutral-500">
              {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {tasks.length === 0 ? (
          <div className="py-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-neutral-100 border-2 border-neutral-300 flex items-center justify-center mb-4">
              <ListTodo className="w-8 h-8 text-neutral-400" />
            </div>
            <p className="text-neutral-500 font-bold uppercase tracking-wider text-sm">
              {t('instructor.practices.tasks.noTasksAssigned')}
            </p>
          </div>
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
      </div>
    </div>
  );
}
