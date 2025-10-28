import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { App, Button, Card, Form, Input, InputNumber, Spin } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getQuizById, updateQuiz } from '../../../../apis/Instructor/InstructorQuiz';

export default function QuizEdit() {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
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
      message.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      await updateQuiz(id, values);
      message.success('Quiz updated successfully');
      navigate(`/instructor/quizzes/${id}`);
    } catch (e) {
      console.error('Failed to update quiz:', e);
      message.error('Failed to update quiz');
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
            <span className="text-2xl font-bold text-slate-900 m-0">Edit Quiz</span>
          </div>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSubmit}
          loading={submitting}
          size="middle"
        >
          Save Changes
        </Button>
      </div>

      {/* Edit Form Card */}
      <Card title="Quiz Information">
        <Form form={form} layout="vertical" className="">
          <Form.Item
            label="Quiz Name"
            name="name"
            rules={[
              { required: true, message: 'Please enter quiz name' },
              { type: 'string', max: 100, message: 'Quiz name cannot exceed 100 characters' },
            ]}
          >
            <Input placeholder="Enter quiz name" size="large" maxLength={100} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              label="Pass Score Criteria (Points)"
              name="passScoreCriteria"
              rules={[
                { required: true, message: 'Please enter pass score criteria' },
                { type: 'number', min: 0, max: 100, message: 'Must be between 0-100' },
              ]}
            >
              <InputNumber
                min={0}
                placeholder="Enter pass score"
                className="w-full"
                size="large"
              />
            </Form.Item>

            <Form.Item
              label="Time Limit (minutes)"
              name="timelimitMinute"
              rules={[
                { required: true, message: 'Please enter time limit' },
                { type: 'number', min: 1, max: 60, message: 'Must be between 1-60' },
              ]}
            >
              <InputNumber
                min={1}
                placeholder="Enter time limit"
                className="w-full"
                size="large"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Total Score (Points)"
            name="totalScore"
            rules={[
              { required: true, message: 'Please enter total score' },
              { type: 'number', min: 0, max: 100, message: 'Must be between 0-100' },
            ]}
          >
            <InputNumber
              min={0}
              placeholder="Enter total score"
              className="w-full"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Description"
            name="description"
            rules={[{ type: 'string', max: 500, message: 'Description cannot exceed 500 characters' }]}
          >
            <Input.TextArea
              rows={4}
              placeholder="Enter quiz description (optional)"
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
