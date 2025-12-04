import React, { useEffect, useState, useCallback } from 'react';
import {
  Card, Spin, Alert, Button, Modal, Form, Input, InputNumber, Select, App, Descriptions, Tag
} from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  getPracticeById,
  updatePractice
} from '../../../../apis/SimulationManager/SimulationManagerPracticeApi';
import PracticeTaskList from './PracticeTaskList';

const { Option } = Select;

// --- Helper Components for Forms ---

const UpdatePracticeForm = ({ initialValues, onUpdate, onCancel, visible, loading, t }) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [initialValues, form]);

  const onFinish = (values) => {
    onUpdate(values, form);
  };

  return (
    <Modal
      title={t('simManager.practiceDetailPartials.updatePractice')}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          {t('common.cancel')}
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
          {t('common.edit')}
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
          label={t('simManager.practiceDetailPartials.practiceName')}
          rules={[{ required: true, message: t('simManager.practiceDetailPartials.practiceNameRequired') }]}
        >
          <Input placeholder={t('simManager.practiceDetailPartials.practiceNamePlaceholder')} maxLength={200} />
        </Form.Item>
        <Form.Item
          name="practiceCode"
          label={t('simManager.practiceDetailPartials.practiceCode')}
        >
          <Input placeholder={t('simManager.practiceDetailPartials.practiceCodePlaceholder')} maxLength={50} />
        </Form.Item>
        <Form.Item
          name="practiceDescription"
          label={t('simManager.practiceDetailPartials.practiceDescription')}
        >
          <Input.TextArea rows={3} placeholder={t('simManager.practiceDetailPartials.practiceDescriptionPlaceholder')} maxLength={1000} />
        </Form.Item>
        <Form.Item
          name="estimatedDurationMinutes"
          label={t('simManager.practiceDetailPartials.estimatedDuration')}
          rules={[{ type: 'number', min: 1, max: 600 }]}
        >
          <InputNumber min={1} max={600} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="difficultyLevel"
          label={t('simManager.practiceDetailPartials.difficultyLevel')}
          rules={[{ required: true, message: t('simManager.practiceDetailPartials.difficultyRequired') }]}
        >
          <Select placeholder={t('simManager.practiceDetailPartials.selectLevel')}>
            <Option value="Entry">{t('simManager.practiceDetailPartials.difficultyEntry')}</Option>
            <Option value="Intermediate">{t('simManager.practiceDetailPartials.difficultyIntermediate')}</Option>
            <Option value="Advanced">{t('simManager.practiceDetailPartials.difficultyAdvanced')}</Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="maxAttempts"
          label={t('simManager.practiceDetailPartials.maxAttempts')}
          rules={[{ type: 'number', min: 1, max: 10 }]}
        >
          <InputNumber min={1} max={10} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="isActive"
          label={t('simManager.practiceDetailPartials.status')}
        >
          <Select placeholder={t('simManager.practiceDetailPartials.selectStatus')}>
            <Option value={true}>{t('simManager.practiceDetailPartials.active')}</Option>
            <Option value={false}>{t('simManager.practiceDetailPartials.inactive')}</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};


// --- Main Component ---

export default function PracticeDetail() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPracticeById(id);
      setPractice(data);
      setError(null);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || t('simManager.practiceDetailPartials.loadFailed'));
    } finally {
      setLoading(false);
    }
  }, [id, t]);

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
      const updated = await updatePractice(practice.id, values);
      message.success(t('simManager.practiceDetailPartials.updateSuccess'));
      setIsUpdateModalVisible(false);
      setPractice({ ...practice, ...updated });
    } catch (e) {
      console.error('Error updating practice:', e);
      let errorMsg = t('simManager.practiceDetailPartials.updateFailed');
      if (e.response?.data?.error?.details?.exceptionMessage) {
        errorMsg = e.response.data.error.details.exceptionMessage;
      } else if (e.response?.data?.error?.message) {
        errorMsg = e.response.data.error.message;
      } else if (e.response?.data?.message) {
        errorMsg = e.response.data.message;
      } else if (e.message) {
        errorMsg = e.message;
      }
      message.error(errorMsg);
    } finally {
      setUpdateLoading(false);
    }
  };

  // --- Render Logic ---
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Spin size="large" tip={t('simManager.practiceDetailPartials.loadingDetails')} className="w-full py-16" />
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

  const getDifficultyLabel = (level) => {
    const map = {
      Entry: t('simManager.practiceDetailPartials.difficultyEntry'),
      Intermediate: t('simManager.practiceDetailPartials.difficultyIntermediate'),
      Advanced: t('simManager.practiceDetailPartials.difficultyAdvanced')
    };
    return map[level] || level;
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
          t={t}
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
            <span className="text-2xl text-slate-900">{t('simManager.practiceDetailPartials.title')}</span>
          </div>
        </div>
      </div>

      {/* Practice Information Card */}
      <div className="mb-6">
        <Card
          title={t('simManager.practiceDetailPartials.practiceInfo')}
          className="shadow mb-6"
          extra={
            <Button type="primary" icon={<EditOutlined />} onClick={handleEditPractice}>
              {t('simManager.practiceDetailPartials.editPractice')}
            </Button>
          }
        >
          <Descriptions bordered column={2}>
            <Descriptions.Item label={t('simManager.practiceDetailPartials.practiceName')} span={2}>
              {practice.practiceName}
            </Descriptions.Item>
            <Descriptions.Item label={t('simManager.practiceDetailPartials.practiceCode')} span={2}>
              {practice.practiceCode}
            </Descriptions.Item>
            <Descriptions.Item label={t('simManager.practiceDetailPartials.duration')}>
              {practice.estimatedDurationMinutes} {t('simManager.practiceDetailPartials.minutes')}
            </Descriptions.Item>
            <Descriptions.Item label={t('simManager.practiceDetailPartials.difficulty')}>
              <Tag color={getDifficultyColor(practice.difficultyLevel)}>
                {getDifficultyLabel(practice.difficultyLevel)}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('simManager.practiceDetailPartials.maxAttempts')}>
              {practice.maxAttempts}
            </Descriptions.Item>
            <Descriptions.Item label={t('simManager.practiceDetailPartials.status')}>
              <Tag color={practice.isActive ? 'green' : 'red'}>
                {practice.isActive ? t('simManager.practiceDetailPartials.active') : t('simManager.practiceDetailPartials.inactive')}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label={t('simManager.practiceDetailPartials.practiceDescription')} span={2}>
              {practice.practiceDescription || t('common.na')}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </div>

      {/* Tasks Section */}
      <div>
        <PracticeTaskList practiceId={id} />
      </div>
    </div>
  );
}
