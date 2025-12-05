import React, { useEffect, useState, useCallback } from 'react';
import {
  Card, Spin, Alert, Button, Descriptions, Tag
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  getPractices
} from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';
import PracticeTaskList from './PracticeTaskList';
import { ArrowLeft } from 'lucide-react';

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

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Spin size="large" tip={t('common.loading')} className="w-full py-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert message={t('common.error')} description={error} type="error" showIcon />
      </div>
    );
  }

  if (!practice) return null;

  const getDifficultyColor = (level) => {
    const map = { Entry: 'green', Intermediate: 'orange', Advanced: 'red' };
    return map[level] || 'default';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Back Button & Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button type="default" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)} />
            <span className="text-2xl text-slate-900">{t('instructor.practices.practiceDetails')}</span>
          </div>
        </div>
      </div>

      {/* Practice Information Card */}
      <div className="mb-6">
        <Card
          title={t('instructor.practices.practiceInformation')}
          className="shadow mb-6"
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label={t('instructor.practices.info.practiceName')} span={2}>
              {practice.practiceName}
            </Descriptions.Item>
            <Descriptions.Item label={t('instructor.practices.info.practiceCode')} span={2}>
              {practice.practiceCode}
            </Descriptions.Item>
            <Descriptions.Item label={t('instructor.practices.info.duration')}>
              {practice.estimatedDurationMinutes} {t('instructor.practices.info.minutes')}
            </Descriptions.Item>
            <Descriptions.Item label={t('instructor.practices.info.difficulty')}>
              <Tag color={getDifficultyColor(practice.difficultyLevel)}>
                {practice.difficultyLevel}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('instructor.practices.info.maxAttempts')}>
              {practice.maxAttempts}
            </Descriptions.Item>
            <Descriptions.Item label={t('instructor.practices.info.status')}>
              <Tag color={practice.isActive ? 'green' : 'red'}>
                {practice.isActive ? t('instructor.practices.info.active') : t('instructor.practices.info.inactive')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('instructor.practices.info.description')} span={2}>
              {practice.practiceDescription || t('instructor.practices.info.na')}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Tasks Section */}
      <div>
        <PracticeTaskList practiceId={id} token={token} />
      </div>
    </div>
  );
}