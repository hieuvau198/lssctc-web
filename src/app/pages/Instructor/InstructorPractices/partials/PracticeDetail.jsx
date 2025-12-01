import React, { useEffect, useState, useCallback } from 'react';
import {
  Card, Spin, Alert, Button, Descriptions, Tag
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getPractices
} from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';
import PracticeTaskList from './PracticeTaskList';
import { ArrowLeft } from 'lucide-react';

export default function PracticeDetail() {
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
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Spin size="large" tip="Loading practice details..." className="w-full py-16" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert message="Error" description={error} type="error" showIcon />
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
            <span className="text-2xl text-slate-900">Practice Details</span>
          </div>
        </div>
      </div>

      {/* Practice Information Card */}
      <div className="mb-6">
        <Card
          title="Practice Information"
          className="shadow mb-6"
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Practice Name" span={2}>
              {practice.practiceName}
            </Descriptions.Item>
            <Descriptions.Item label="Practice Code" span={2}>
              {practice.practiceCode}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {practice.estimatedDurationMinutes} minutes
            </Descriptions.Item>
            <Descriptions.Item label="Difficulty">
              <Tag color={getDifficultyColor(practice.difficultyLevel)}>
                {practice.difficultyLevel}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Max Attempts">
              {practice.maxAttempts}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={practice.isActive ? 'green' : 'red'}>
                {practice.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Description" span={2}>
              {practice.practiceDescription || 'N/A'}
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