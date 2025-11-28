import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, ListTodo, ChevronRight } from 'lucide-react';
import {
  getPractices, getTasksByPracticeId
} from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';

// Main Component
export default function PracticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getAuthToken();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPractices({ page: 1, pageSize: 100 });
      const found = res.items.find(p => String(p.id) === String(id));
      setPractice(found || null);

      if (found && token) {
        const data = await getTasksByPracticeId(id, token);
        setTasks(Array.isArray(data) ? data : []);
      }
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'Entry':
        return 'bg-emerald-100 text-emerald-800 ring-1 ring-emerald-600/20';
      case 'Intermediate':
        return 'bg-amber-100 text-amber-800 ring-1 ring-amber-600/20';
      case 'Advanced':
        return 'bg-rose-100 text-rose-800 ring-1 ring-rose-600/20';
      default:
        return 'bg-gray-100 text-gray-800 ring-1 ring-gray-600/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading practice details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <p className="font-semibold">Error: {error}</p>
      </div>
    );
  }

  if (!practice) return null;

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex items-center gap-2 text-sm font-medium text-blue-600">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-white hover:shadow-sm transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          <ChevronRight className="h-4 w-4" />
          <span className="uppercase tracking-wider text-xs">Practice Details</span>
        </div>
      </div>

      {/* Main Content - Unified Practice Information */}
      <div className="mb-6">
        <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
          {/* Practice Header with Name and Code */}
          <div className="mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-2xl">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Practice Information</h2>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-2">
              {practice.practiceName}
            </h1>
            {practice.practiceCode && (
              <p className="text-lg text-gray-500 font-mono">
                {practice.practiceCode}
              </p>
            )}
          </div>

          {/* Combined Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Section - Description and Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                  Description
                </label>
                <p className="text-gray-700 leading-relaxed">
                  {practice.practiceDescription || 'No description provided'}
                </p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                {/* Duration */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Duration
                  </label>
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-bold">
                    <Clock className="h-4 w-4" />
                    <span>{practice.estimatedDurationMinutes} minutes</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Difficulty Level
                  </label>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm ${getDifficultyColor(practice.difficultyLevel)}`}>
                    {practice.difficultyLevel}
                  </span>
                </div>

                {/* Max Attempts */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Max Attempts
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-gray-900">{practice.maxAttempts}</span>
                    <span className="text-sm text-gray-500">tries</span>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    Status
                  </label>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border ${practice.isActive
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                    }`}>
                    <span className={`h-2 w-2 rounded-full ${practice.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    {practice.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Quick Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 p-6">
                <h3 className="text-lg font-bold text-blue-900 mb-6">Quick Summary</h3>

                <div className="space-y-4">
                  <div className="p-4 bg-white/60 rounded-2xl">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Duration</p>
                    <p className="text-2xl font-bold text-blue-900">{practice.estimatedDurationMinutes} min</p>
                  </div>

                  <div className="p-4 bg-white/60 rounded-2xl">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Difficulty</p>
                    <p className="text-2xl font-bold text-blue-900">{practice.difficultyLevel}</p>
                  </div>

                  <div className="p-4 bg-white/60 rounded-2xl">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Max Attempts</p>
                    <p className="text-2xl font-bold text-blue-900">{practice.maxAttempts}</p>
                  </div>

                  <div className="p-4 bg-white/60 rounded-2xl">
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Tasks</p>
                    <p className="text-2xl font-bold text-blue-900">{tasks.length}</p>
                  </div>

                  {practice.createdDate && (
                    <div className="pt-4 border-t border-blue-200">
                      <p className="text-xs font-bold text-blue-600 uppercase tracking-wide mb-1">Created</p>
                      <p className="text-sm text-blue-900 font-medium">
                        {new Date(practice.createdDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-50 rounded-2xl">
              <ListTodo className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Practice Tasks</h2>
          </div>
          <span className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-bold">
            {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="py-12 text-center bg-gray-50 rounded-2xl">
            <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-6 font-medium">No tasks assigned to this practice yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map((task, idx) => (
              <div
                key={task.id}
                className="p-6 border border-gray-200 rounded-2xl hover:border-purple-300 hover:bg-purple-50/30 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Task Number */}
                  <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <span className="text-sm font-bold text-purple-600">{idx + 1}</span>
                  </div>

                  {/* Task Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{task.taskName}</h3>
                      {task.taskCode && (
                        <span className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-mono font-medium border border-gray-200">
                          {task.taskCode}
                        </span>
                      )}
                    </div>

                    {task.taskDescription && (
                      <p className="text-sm text-gray-600 mb-3">{task.taskDescription}</p>
                    )}

                    {task.expectedResult && (
                      <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                        <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide mb-1">Expected Result</p>
                        <p className="text-sm text-emerald-700">{task.expectedResult}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}