// src/app/pages/Instructor/InstructorClasses/partials/Sections/ActivityDetail/ActivitySessionManager.jsx

import React, { useEffect, useState } from 'react';
import { Card, Switch, DatePicker, Button, Typography, message, Spin, Alert, Form } from 'antd';
import { ClockCircleOutlined, SaveOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { getActivitySessionsByClassId, updateActivitySession } from '../../../../../../apis/Instructor/InstructorSessionApi';

const { Text, Title } = Typography;
const { RangePicker } = DatePicker;

const ActivitySessionManager = ({ classId, activityId }) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSession();
  }, [classId, activityId]);

  const fetchSession = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all sessions for class and find the one for this activity
      // (Optimisation: Backend could expose a direct endpoint, but this works for now)
      const sessions = await getActivitySessionsByClassId(classId);
      const foundSession = sessions.find(s => s.activityId === activityId);
      
      if (foundSession) {
        setSession(foundSession);
        form.setFieldsValue({
          isActive: foundSession.isActive,
          timeRange: foundSession.startTime && foundSession.endTime 
            ? [dayjs(foundSession.startTime), dayjs(foundSession.endTime)] 
            : []
        });
      } else {
        // If not found, it might mean the backend hasn't generated it yet (e.g. class hasn't started)
        // or a sync issue.
        setSession(null);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load session settings.');
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    if (!session) return;

    setSaving(true);
    try {
      const { isActive, timeRange } = values;
      
      // Use .format('YYYY-MM-DDTHH:mm:ss') to send the local time string directly
      // instead of .toISOString() which converts to UTC.
      const payload = {
        isActive: isActive,
        startTime: timeRange && timeRange[0] ? timeRange[0].format('YYYY-MM-DDTHH:mm:ss') : null,
        endTime: timeRange && timeRange[1] ? timeRange[1].format('YYYY-MM-DDTHH:mm:ss') : null
      };

      const updated = await updateActivitySession(session.id, payload);
      setSession(updated);
      message.success(t('instructor.classes.sessionManager.updateSuccess') || 'Session updated successfully');
    } catch (err) {
      console.error(err);
      message.error(err.message || 'Failed to update session');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center"><Spin /></div>;
  }

  if (error) {
    return <Alert type="error" message={error} showIcon className="mb-4" />;
  }

  if (!session) {
    return (
      <Alert 
        type="warning" 
        message="Session Not Found" 
        description="This activity does not have an active session configuration for this class yet." 
        showIcon 
        className="mb-4"
      />
    );
  }

  return (
    <Card 
      size="small" 
      title={<span><ClockCircleOutlined className="mr-2"/> {t('instructor.classes.sessionManager.title') || 'Session Availability'}</span>}
      className="mb-6 shadow-sm border-blue-100"
      headStyle={{ backgroundColor: '#f0f5ff', color: '#1d39c4' }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          isActive: session.isActive,
          timeRange: session.startTime && session.endTime ? [dayjs(session.startTime), dayjs(session.endTime)] : []
        }}
      >
        <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
          <Form.Item 
            name="isActive" 
            label={t('instructor.classes.sessionManager.status') || 'Access Status'} 
            valuePropName="checked"
            className="mb-4 md:mb-0"
          >
            <Switch 
              checkedChildren={t('common.active') || 'Active'} 
              unCheckedChildren={t('common.inactive') || 'Inactive'} 
            />
          </Form.Item>

          <Form.Item 
            name="timeRange" 
            label={t('instructor.classes.sessionManager.timeWindow') || 'Available Time Window'}
            className="flex-1 mb-4 md:mb-0"
            help={t('instructor.classes.sessionManager.timeHelp') || 'Leave empty for unlimited time access while Active.'}
          >
            <RangePicker 
              showTime={{ format: 'HH:mm' }} 
              format="YYYY-MM-DD HH:mm" 
              className="w-full"
              placeholder={['Start Time', 'End Time']}
            />
          </Form.Item>

          <div className="md:mt-8">
            <Button 
              type="primary" 
              htmlType="submit" 
              icon={<SaveOutlined />} 
              loading={saving}
            >
              {t('common.save') || 'Save'}
            </Button>
          </div>
        </div>
      </Form>
    </Card>
  );
};

export default ActivitySessionManager;