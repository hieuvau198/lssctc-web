import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Form, Alert, Descriptions, Tag, Spin, message, Result } from 'antd';
import { ClockCircleOutlined, FileTextOutlined, LockOutlined, CalendarOutlined, CheckCircleOutlined, TrophyOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import PageNav from '../../../components/PageNav/PageNav';
import PartialApi from '../../../apis/FinalExam/PartialApi';

export default function FinalExam() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState('');
  const [exam, setExam] = useState(null);

  useEffect(() => {
    if (id) {
      fetchExamDetail();
    } else {
      setError(t('exam.invalidId', 'Invalid Exam ID'));
      setDataLoading(false);
    }
  }, [id]);

  const fetchExamDetail = async () => {
    try {
      setDataLoading(true);
      setError('');
      console.log('Fetching exam details for ID:', id);

      const data = await PartialApi.getMyPartialDetail(id);
      console.log('Fetched data:', data);

      if (data) {
        setExam(data);
      } else {
        setError(t('exam.notFound', 'Exam not found'));
      }
    } catch (err) {
      console.error('Error fetching exam:', err);
      console.log('Failed Request URL:', err.config?.baseURL + err.config?.url);
      const errorMsg = err.response?.data?.message || err.message || t('exam.fetchError', 'Failed to load exam details');
      setError(errorMsg);
      message.error(errorMsg);
    } finally {
      setDataLoading(false);
    }
  };

  const handleStartExam = async (values) => {
    setLoading(true);
    setError('');

    try {
      let response;
      const payload = { examCode: values.openCode.trim() };

      if (exam.type === 'Theory') {
        response = await PartialApi.startTheoryExam(id, payload);
      } else if (exam.type === 'Simulation') {
        response = await PartialApi.startSimulationExam(id, payload);
      } else {
        // Default or other types if applicable
        message.error("Unknown exam type");
        setLoading(false);
        return;
      }

      // Navigate to exam taking page with the response data (which typically includes questions for TE)
      navigate(`/final-exam/${id}/take`, { state: { examData: exam, sessionData: response } });

    } catch (err) {
      console.error(err);
      // The API should return an error if the code is invalid
      if (err.response?.status === 401) {
        setError(t('exam.invalidCode', 'Mã đề không hợp lệ. Vui lòng kiểm tra lại.'));
      } else {
        setError(err.response?.data?.message || t('exam.startError', 'Failed to start exam. Check your code.'));
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Submitted': return 'green';
      case 'In Progress': return 'blue';
      case 'Not Started': return 'default';
      default: return 'default';
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50/30 p-4">
        <Card className="max-w-md w-full shadow-2xl border-0 bg-white/80 backdrop-blur-lg rounded-2xl overflow-hidden">
          <Result
            status="error"
            title={<span className="text-xl font-bold text-slate-800">{t('error.title', 'Có lỗi xảy ra')}</span>}
            subTitle={<span className="text-slate-600 text-base">{error}</span>}
            extra={[
              <Button
                type="primary"
                key="retry"
                onClick={() => {
                  setError('');
                  fetchExamDetail();
                }}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0 h-10 px-8 rounded-lg shadow-lg shadow-blue-200 font-medium"
              >
                {t('common.retry', 'Thử lại')}
              </Button>
            ]}
          />
        </Card>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert message="Exam not found" type="warning" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 py-4">
      <div className="max-w-6xl mx-auto px-4">
        <PageNav
          items={[
            { title: t('exam.finalExam', 'Final Exam') },
            { title: exam.quizName || exam.practiceName || exam.type }
          ]}
        />

        <div>
          <Card className="shadow-xl gap-y-2 border-blue-100 bg-white/80 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-xl shadow-blue-200 mb-6">
                <FileTextOutlined className="text-5xl text-white" />
              </div>
              <h1 className="text-4xl font-bold text-slate-800 mb-3">
                {exam.quizName || exam.practiceName || `${exam.type} Exam`}
              </h1>
              {exam.description && (
                <p className="text-slate-600 text-lg">{exam.description}</p>
              )}
            </div>

            <div className="mb-6">
              <Descriptions bordered column={{ xxl: 2, xl: 2, lg: 2, md: 1, sm: 1, xs: 1 }}>
                <Descriptions.Item
                  label={<span><ClockCircleOutlined className="mr-2" />{t('exam.duration', 'Duration')}</span>}
                >
                  {exam.duration} {t('exam.minutes', 'minutes')}
                </Descriptions.Item>

                <Descriptions.Item
                  label={<span><TrophyOutlined className="mr-2" />{t('exam.weight', 'Weight')}</span>}
                >
                  {exam.examWeight}%
                </Descriptions.Item>

                {exam.marks !== null && (
                  <Descriptions.Item
                    label={<span><CheckCircleOutlined className="mr-2" />{t('exam.marks', 'Marks')}</span>}
                  >
                    {exam.marks}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label={t('exam.status', 'Status')}>
                  <Tag color={getStatusColor(exam.status)}>{exam.status || 'Not Started'}</Tag>
                </Descriptions.Item>

                {exam.startTime && (
                  <Descriptions.Item
                    label={<span><CalendarOutlined className="mr-2" />{t('exam.startTime', 'Start Time')}</span>}
                  >
                    {formatDate(exam.startTime)}
                  </Descriptions.Item>
                )}

                {exam.completeTime && (
                  <Descriptions.Item
                    label={<span><CalendarOutlined className="mr-2" />{t('exam.completeTime', 'Complete Time')}</span>}
                  >
                    {formatDate(exam.completeTime)}
                  </Descriptions.Item>
                )}

                <Descriptions.Item label={t('exam.type', 'Type')}>
                  {exam.type}
                </Descriptions.Item>
              </Descriptions>
            </div>

            {/* Only show start form if exam is NOT submitted */}
            {exam.status !== 'Submitted' && exam.status !== 'Completed' && (
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
            )}

            {/* If submitted, maybe show a result summary or just the status above is enough */}
            {(exam.status === 'Submitted' || exam.status === 'Completed') && (
              <Alert
                message={t('exam.completedTitle', 'Exam Completed')}
                description={t('exam.completedDesc', 'You have completed this exam.')}
                type="success"
                showIcon
                className="mb-6"
              />
            )}

            {exam.instructions && exam.instructions.length > 0 && (
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
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
