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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <PageNav
          items={[
            //   { title: t('common.home', 'Home'), href: '/' },
            { title: t('exam.finalExam', 'Final Exam') },
          ]}
        />

        <div>
          <Card className="shadow-xl gap-y-2 border-blue-100 bg-white/80 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-200 mb-6">
                <FileTextOutlined className="text-5xl text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">{exam.name}</h1>
              <p className="text-slate-600 text-lg">{exam.description}</p>
            </div>

            <div className="mb-6">
              <Descriptions bordered column={1} >
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
            </div>

            <div className="mb-6">
              <Card
                type="inner"
                title={<span className="font- text-white">{t('exam.enterOpenCode', 'Enter Open Code to Start')}</span>}
                className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-md"
                headStyle={{ background: 'linear-gradient(to right, #3b82f6, #1d4ed8)', color: 'white' }}
              >
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
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      loading={loading}
                      className="font-semibold text-lg h-12 shadow-lg shadow-blue-200 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0"
                    >
                      {t('exam.startExam', 'Start Exam')}
                    </Button>
                  </Form.Item>
                </Form>
              </Card>
            </div>

            <div>
              <Card
                type="inner"
                title={<span className="font-bold text-slate-700">{t('exam.instructions', 'Instructions')}</span>}
                className="mb-6 border-blue-100 shadow-md"
                headStyle={{ background: 'linear-gradient(to right, #dbeafe, #bfdbfe)' }}
              >
                <ul className="list-disc ml-6 space-y-3">
                  {exam.instructions.map((instruction, idx) => (
                    <li key={idx} className="text-slate-700 leading-relaxed">
                      {instruction}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
