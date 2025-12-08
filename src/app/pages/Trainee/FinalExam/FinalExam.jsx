import React, { useState } from 'react';
import { Card, Button, Input, Form, Alert, Descriptions, Tag } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, LockOutlined, CalendarOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PageNav from '../../../components/PageNav/PageNav';
import { mockFinalExam } from '../../../mocks/finalExam';

export default function FinalExam() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // In real app, fetch exam data from API using id
  const exam = mockFinalExam;

  const handleStartExam = (values) => {
    setLoading(true);
    setError('');

    // Validate open code
    if (values.openCode.trim().toUpperCase() !== exam.openCode) {
      setError(t('exam.invalidOpenCode', 'Invalid open code. Please try again.'));
      setLoading(false);
      return;
    }

    // Navigate to exam taking page
    setTimeout(() => {
      navigate(`/final-exam/${id}/take`, { state: { examData: exam } });
      setLoading(false);
    }, 500);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <PageNav
        items={[
        //   { title: t('common.home', 'Home'), href: '/' },
          { title: t('exam.finalExam', 'Final Exam') },
        ]}
      />

      <div className="mt-4">
        <Card className="shadow-sm gap-y-2">
          <div className="text-center mb-6">
            <FileTextOutlined className="text-6xl text-blue-500 mb-4" />
            <h1 className="text-3xl font-bold text-slate-800 mb-2">{exam.name}</h1>
            <p className="text-slate-600">{exam.description}</p>
          </div>

          <Descriptions bordered column={1} className="mb-6">
            <Descriptions.Item
              label={
                <span>
                  <CalendarOutlined className="mr-2" />
                  {t('exam.examDate', 'Exam Date')}
                </span>
              }
            >
              {formatDate(exam.date)}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <ClockCircleOutlined className="mr-2" />
                  {t('exam.duration', 'Duration')}
                </span>
              }
            >
              {exam.duration} {t('exam.minutes', 'minutes')}
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span>
                  <FileTextOutlined className="mr-2" />
                  {t('exam.totalQuestions', 'Total Questions')}
                </span>
              }
            >
              {exam.totalQuestions} {t('exam.questions', 'questions')}
            </Descriptions.Item>
            <Descriptions.Item label={t('exam.passingScore', 'Passing Score')}>
              <Tag color="green">{exam.passingScore}%</Tag>
            </Descriptions.Item>
          </Descriptions>

          <Card type="inner" title={t('exam.instructions', 'Instructions')} className="mb-6">
            <ul className="list-disc ml-6 space-y-2">
              {exam.instructions.map((instruction, idx) => (
                <li key={idx} className="text-slate-700">
                  {instruction}
                </li>
              ))}
            </ul>
          </Card>

          <Card type="inner" title={t('exam.enterOpenCode', 'Enter Open Code to Start')} className="bg-blue-50">
            <Form form={form} onFinish={handleStartExam} layout="vertical">
              <Form.Item
                name="openCode"
                label={t('exam.openCode', 'Open Code')}
                rules={[
                  { required: true, message: t('exam.openCodeRequired', 'Please enter the open code') },
                ]}
              >
                <Input
                  prefix={<LockOutlined />}
                  placeholder={t('exam.openCodePlaceholder', 'Enter open code')}
                  size="large"
                  disabled={loading}
                />
              </Form.Item>

              {error && (
                <Alert message={error} type="error" showIcon className="mb-4" />
              )}

              <Form.Item className="mb-0">
                <Button type="primary" htmlType="submit" size="large" block loading={loading}>
                  {t('exam.startExam', 'Start Exam')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Card>
      </div>
    </div>
  );
}
