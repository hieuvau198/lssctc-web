import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Button, Alert, Spin } from 'antd';
import { useTranslation } from 'react-i18next';
import { createActivityInSection, getActivitiesBySectionId } from '../../../../../apis/Instructor/InstructorSectionApi';

const { Option } = Select;
const { TextArea } = Input;

const AddActivityModal = ({ sectionId, sectionDuration = 0, isVisible, onClose, onActivityAdded }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingActivities, setFetchingActivities] = useState(false);
  const [usedDuration, setUsedDuration] = useState(0);
  const [isDurationValid, setIsDurationValid] = useState(true);

  // Watch duration field changes
  const durationValue = Form.useWatch('duration', form);

  // Fetch existing activities when modal opens to calculate used duration
  useEffect(() => {
    if (isVisible && sectionId) {
      fetchExistingActivities();
    }
    if (!isVisible) {
      // Reset state when modal closes
      setUsedDuration(0);
      setError(null);
      setIsDurationValid(true);
    }
  }, [isVisible, sectionId]);

  const fetchExistingActivities = async () => {
    setFetchingActivities(true);
    try {
      const activities = await getActivitiesBySectionId(sectionId);
      const totalUsed = activities.reduce((sum, activity) => sum + (activity.duration || 0), 0);
      setUsedDuration(totalUsed);
    } catch (err) {
      console.error('Failed to fetch activities:', err);
      setUsedDuration(0);
    } finally {
      setFetchingActivities(false);
    }
  };

  const remainingDuration = sectionDuration - usedDuration;

  // Validate duration in real-time when durationValue changes
  useEffect(() => {
    if (sectionDuration > 0) {
      const isValid = durationValue && durationValue >= 1 && durationValue <= remainingDuration;
      setIsDurationValid(isValid);
    } else {
      // If no section duration limit, just check if value is valid
      setIsDurationValid(durationValue && durationValue >= 1);
    }
  }, [durationValue, remainingDuration, sectionDuration]);

  const handleFinish = async (values) => {
    // Validate duration before submitting
    if (sectionDuration > 0 && values.duration > remainingDuration) {
      setError(
        t('instructor.classes.addActivityModal.durationExceedsLimit', {
          remaining: remainingDuration,
          sectionDuration: sectionDuration,
          usedDuration: usedDuration
        })
      );
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createActivityInSection(sectionId, {
        activityTitle: values.title,
        activityDescription: values.description,
        activityType: values.type,
        estimatedDurationMinutes: values.duration,
      });

      // Refresh parent UI (activities list)
      onActivityAdded();
      form.resetFields();
      onClose();

    } catch (err) {
      setError(
        err?.message || t('instructor.classes.addActivityModal.addFailed')
      );
    } finally {
      setLoading(false);
    }
  };


  const handleCancel = () => {
    form.resetFields();
    setError(null);
    onClose();
  };

  // Custom validator for duration field
  const validateDuration = (_, value) => {
    if (!value || value < 1) {
      return Promise.reject(new Error(t('instructor.classes.addActivityModal.durationRequired')));
    }
    if (sectionDuration > 0 && value > remainingDuration) {
      return Promise.reject(
        new Error(
          t('instructor.classes.addActivityModal.durationExceedsLimit', {
            remaining: remainingDuration,
            sectionDuration: sectionDuration,
            usedDuration: usedDuration
          })
        )
      );
    }
    return Promise.resolve();
  };

  // Hide add button when duration is invalid (exceeds remaining time)
  const shouldHideAddButton = !isDurationValid || (sectionDuration > 0 && remainingDuration <= 0);

  return (
    <Modal
      title={t('instructor.classes.addActivityModal.title')}
      visible={isVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          {t('instructor.classes.addActivityModal.cancel')}
        </Button>,
        // Only show Add Activity button when duration is valid
        !shouldHideAddButton && !fetchingActivities && (
          <Button key="submit" type="primary" loading={loading} onClick={() => form.submit()}>
            {t('instructor.classes.addActivityModal.addActivity')}
          </Button>
        ),
      ].filter(Boolean)}
    >
      {fetchingActivities ? (
        <div className="flex justify-center items-center py-8">
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            type: 'Material',
            duration: Math.min(10, remainingDuration > 0 ? remainingDuration : 10),
          }}
        >
          {error && <Alert message={t('common.error')} description={error} type="error" showIcon closable className="mb-4" />}

          {/* Duration info message */}
          {sectionDuration > 0 && (
            <Alert
              message={t('instructor.classes.addActivityModal.durationInfo', {
                remaining: remainingDuration,
                sectionDuration: sectionDuration,
                usedDuration: usedDuration
              })}
              type={remainingDuration <= 0 ? 'warning' : 'info'}
              showIcon
              className="mb-4"
            />
          )}

          <Form.Item
            name="title"
            label={t('instructor.classes.addActivityModal.activityTitle')}
            rules={[{ required: true, message: t('instructor.classes.addActivityModal.activityTitleRequired') }]}
          >
            <Input placeholder={t('instructor.classes.addActivityModal.activityTitlePlaceholder')} />
          </Form.Item>
          <Form.Item
            name="description"
            label={t('instructor.classes.addActivityModal.description')}
            rules={[{ required: true, message: t('instructor.classes.addActivityModal.descriptionRequired') }]}
          >
            <TextArea rows={3} placeholder={t('instructor.classes.addActivityModal.descriptionPlaceholder')} />
          </Form.Item>
          <Form.Item
            name="type"
            label={t('instructor.classes.addActivityModal.activityType')}
            rules={[{ required: true, message: t('instructor.classes.addActivityModal.activityTypeRequired') }]}
          >
            <Select>
              <Option value="Material">{t('instructor.classes.addActivityModal.typeMaterial')}</Option>
              <Option value="Quiz">{t('instructor.classes.addActivityModal.typeQuiz')}</Option>
              <Option value="Practice">{t('instructor.classes.addActivityModal.typePractice')}</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="duration"
            label={t('instructor.classes.addActivityModal.duration')}
            rules={[{ validator: validateDuration }]}
          >
            <InputNumber
              min={1}
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Form>
      )}
    </Modal>
  );
};

export default AddActivityModal;

