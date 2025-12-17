import React, { useEffect, useState, useCallback } from 'react';
import { Skeleton, Empty } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPractices } from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';
import PracticeTaskList from './PracticeTaskList';
import { ArrowLeft, Settings, Clock, Target, RotateCcw, CheckCircle, XCircle, FileText, AlertCircle } from 'lucide-react';

export default function PracticeDetail() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
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
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || t('instructor.practices.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

  // Loading State
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <div className="bg-black border-2 border-black p-6 mb-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton.Button style={{ width: 300, height: 40 }} active className="bg-neutral-800" />
        </div>
        <div className="bg-white border-2 border-black p-6 mb-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <div className="bg-white border-2 border-black p-6">
          <div className="h-1 bg-red-500 -mx-6 -mt-6 mb-4" />
          <div className="flex items-center gap-3 text-red-600">
            <AlertCircle className="w-6 h-6" />
            <span className="font-bold uppercase">{error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!practice) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
      {/* Header - Industrial Theme */}
      <div className="bg-black border-2 border-black p-5 mb-6">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="w-12 h-12 bg-yellow-400 border-2 border-black flex items-center justify-center hover:scale-105 transition-transform"
            >
              <ArrowLeft className="w-6 h-6 text-black" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <span className="px-3 py-1 bg-yellow-400 text-black font-bold text-xs uppercase tracking-wider border-2 border-black">
                  {practice.practiceCode}
                </span>
                <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider border ${getDifficultyStyle(practice.difficultyLevel)}`}>
                  {practice.difficultyLevel}
                </span>
              </div>
              <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                {practice.practiceName}
              </h1>
            </div>
          </div>
          {/* Status Badge */}
          <div className={`flex items-center gap-2 px-4 py-2 border-2 ${practice.isActive ? 'bg-green-400 border-green-600 text-green-900' : 'bg-red-400 border-red-600 text-red-900'}`}>
            {practice.isActive ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="font-bold uppercase text-sm">
              {practice.isActive ? t('instructor.practices.info.active') : t('instructor.practices.info.inactive')}
            </span>
          </div>
        </div>
      </div>

      {/* Practice Information Card */}
      <div className="bg-white border-2 border-black overflow-hidden mb-6">
        <div className="h-1 bg-yellow-400" />
        <div className="px-6 py-4 border-b-2 border-neutral-200 bg-neutral-50">
          <h2 className="font-black text-black uppercase tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5" />
            {t('instructor.practices.practiceInformation')}
          </h2>
        </div>

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="border-2 border-black p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                  <Clock className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                    {t('instructor.practices.info.duration')}
                  </div>
                  <div className="text-xl font-black text-black">
                    {practice.estimatedDurationMinutes} {t('instructor.practices.info.minutes')}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black border-2 border-black flex items-center justify-center">
                  <Target className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                    {t('instructor.practices.info.difficulty')}
                  </div>
                  <div className="text-xl font-black text-black">
                    {practice.difficultyLevel || 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                  <RotateCcw className="w-5 h-5 text-black" />
                </div>
                <div>
                  <div className="text-xs text-neutral-500 uppercase font-bold tracking-wider">
                    {t('instructor.practices.info.maxAttempts')}
                  </div>
                  <div className="text-xl font-black text-black">
                    {practice.maxAttempts}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-2 border-black">
            <div className="px-4 py-3 bg-neutral-50 border-b-2 border-black flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span className="font-bold text-black uppercase text-sm tracking-wider">
                {t('instructor.practices.info.description')}
              </span>
            </div>
            <div className="p-4">
              <p className="text-neutral-700">
                {practice.practiceDescription || t('instructor.practices.info.na')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <PracticeTaskList practiceId={id} token={token} />
    </div>
  );
}