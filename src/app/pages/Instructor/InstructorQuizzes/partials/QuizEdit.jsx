import { ArrowLeft, Save } from 'lucide-react';
import { App, Button, Card, Form, Input, InputNumber, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getQuizById, updateQuiz } from '../../../../apis/Instructor/InstructorQuiz';

export default function QuizEdit() {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    loadQuiz();
  }, [id]);

  const loadQuiz = async () => {
    setLoading(true);
    try {
      const data = await getQuizById(id);
      setQuiz(data);
      form.setFieldsValue({
        name: data.name,
        passScoreCriteria: data.passScoreCriteria,
        timelimitMinute: data.timelimitMinute,
        totalScore: data.totalScore,
        description: data.description,
      });
    } catch (e) {
      console.error('Failed to load quiz:', e);
      message.error(t('instructor.quizzes.messages.loadQuizFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      await updateQuiz(id, values);
      message.success(t('instructor.quizzes.messages.updateQuizSuccess'));
      navigate(-1);
    } catch (e) {
      console.error('Failed to update quiz:', e);
      message.error(t('instructor.quizzes.messages.updateQuizFailed'));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate(-1)}
            className="flex items-center"/>
          <div>
            <span className="text-2xl font-bold text-slate-900 m-0">{t('instructor.quizzes.editQuiz')}</span>
          </div>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={submitting}
          size="middle"
        >
          {t('common.saveChanges')}
        </Button>
      </div>

      {/* Edit Form Card */}
      <Card title={t('instructor.quizzes.quizInformation')}>
        <Form form={form} layout="vertical" className="">
          <Form.Item
            label={t('instructor.quizzes.form.quizName')}
            name="name"
            rules={[
              { required: true, message: t('instructor.quizzes.form.quizNameRequired') },
              { type: 'string', max: 100, message: t('instructor.quizzes.validation.quizNameMax') },
            ]}
          >
            <Input placeholder={t('instructor.quizzes.form.quizNamePlaceholder')} size="large" maxLength={100} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label={t('instructor.quizzes.form.passScore')}
              name="passScoreCriteria"
              rules={[
                { required: true, message: t('instructor.quizzes.validation.passScoreRequired') },
                { type: 'number', min: 0, max: 10, message: t('instructor.quizzes.validation.mustBeBetween0And10') },
              ]}
            >
              <InputNumber
                min={0}
                placeholder={t('instructor.quizzes.form.enterPassScore')}
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label={t('instructor.quizzes.form.timeLimit')}
              name="timelimitMinute"
              rules={[
                { required: true, message: t('instructor.quizzes.validation.timeLimitRequired') },
                { type: 'number', min: 1, max: 60, message: t('instructor.quizzes.validation.mustBeBetween1And60') },
              ]}
            >
              <InputNumber
                min={1}
                placeholder={t('instructor.quizzes.form.enterTimeLimit')}
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>

          {/* <Form.Item
            label="Total Score (Points)"
            name="totalScore"
            rules={[
              { required: true, message: 'Please enter total score' },
              { type: 'number', min: 0, max: 10, message: 'Must be between 0-10' },
            ]}
          >
            <InputNumber
              min={0}
              placeholder="Enter total score"
              className="w-full"
              size="large"
            />
          </Form.Item> */}

          <Form.Item
            label={t('instructor.quizzes.form.description')}
            name="description"
            rules={[{ type: 'string', max: 500, message: t('instructor.quizzes.validation.descriptionMax') }]}
          >
            <Input.TextArea
              rows={4}
              placeholder={t('instructor.quizzes.form.descriptionPlaceholder')}
              size="large"
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
