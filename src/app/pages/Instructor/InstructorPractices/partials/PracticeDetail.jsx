import React, { useEffect, useState, useCallback } from 'react';
import {
  Card, Spin, Alert, Button, Modal, Form, Input, InputNumber, Select, message, Descriptions, Tag
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { EditOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import {
  getPractices,
  updatePractice
} from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';
import PracticeTaskList from './PracticeTaskList';
import { ArrowLeft } from 'lucide-react';

const { Option } = Select;

// --- Helper Components for Forms ---

const UpdatePracticeForm = ({ initialValues, onUpdate, onCancel, visible, loading }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    onUpdate(values, form);
  };

  return (
    <Modal
      title="Update Practice"
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          Update
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="practiceName"
          label="Practice Name"
          rules={[{ required: true, message: 'Practice name is required.' }]}
        >
          <Input placeholder="Practice Name" maxLength={200} />
        </Form.Item>
        <Form.Item
          name="practiceCode"
          label="Practice Code"
        >
          <Input placeholder="Practice Code" maxLength={50} />
        </Form.Item>
        <Form.Item
          name="practiceDescription"
          label="Description"
        >
          <Input.TextArea rows={3} placeholder="Practice Description" maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="estimatedDurationMinutes"
          label="Estimated Duration (Minutes)"
          rules={[{ type: 'number', min: 1, max: 600 }]}
        >
          <InputNumber min={1} max={600} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="difficultyLevel"
          label="Difficulty Level"
          rules={[{ required: true, message: 'Please select a difficulty level.' }]}
        >
          <Select placeholder="Select level">
            <Option value="Entry">Entry</Option>
            <Option value="Intermediate">Intermediate</Option>
            <Option value="Advanced">Advanced</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="maxAttempts"
          label="Max Attempts"
          rules={[{ type: 'number', min: 1, max: 10 }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="isActive"
          label="Status"
        >
          <Select placeholder="Select status">
            <Option value={true}>Active</Option>
            <Option value={false}>Inactive</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};


// --- Main Component ---

export default function PracticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
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

  // --- Handlers for Practice ---
  const handleEditPractice = () => {
    setIsUpdateModalVisible(true);
  };

  const handleUpdatePractice = async (values) => {
    if (!practice) return;

    setUpdateLoading(true);
    try {
      // The backend DTO already handles the nullability for optional fields
      const updated = await updatePractice(practice.id, values, token);

      message.success('Practice updated successfully.');
      setIsUpdateModalVisible(false);
      // Update state immediately
      setPractice({ ...practice, ...updated });
    } catch (e) {
      console.error('Error updating practice:', e);
      message.error(e.response?.data?.Message || 'Failed to update practice.');
    } finally {
      setUpdateLoading(false);
    }
  };

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
      {/* Modals */}
      {practice && (
        <UpdatePracticeForm
          visible={isUpdateModalVisible}
          onCancel={() => setIsUpdateModalVisible(false)}
          onUpdate={handleUpdatePractice}
          loading={updateLoading}
          initialValues={{
            practiceName: practice.practiceName,
            practiceCode: practice.practiceCode,
            practiceDescription: practice.practiceDescription,
            estimatedDurationMinutes: practice.estimatedDurationMinutes,
            difficultyLevel: practice.difficultyLevel,
            maxAttempts: practice.maxAttempts,
            isActive: practice.isActive,
          }}
        />
      )}

      {/* Back Button & Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Button type="default" icon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}/>
            <span className="text-2xl text-slate-900">Practice Details</span>
          </div>
        </div>
      </div>

      {/* Practice Information Card */}
      <div className="mb-6">
        <Card
          title="Practice Information"
          className="shadow mb-6"
          extra={
            <Button type="primary" icon={<EditOutlined />} onClick={handleEditPractice}>
              Edit Practice
            </Button>
          }
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