// src/app/pages/Instructor/InstructorClasses/partials/Sections/ActivityDetail/ActivitySessionManager.jsx

import React, { useEffect, useState } from 'react';
import { Switch, DatePicker, Button, message, Spin, Alert, Form } from 'antd';
import { Clock, Save, Calendar, ToggleLeft } from 'lucide-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { getActivitySessionsByClassId, updateActivitySession } from '../../../../../../apis/Instructor/InstructorSessionApi';
import DayTimeFormat from '../../../../../../components/DayTimeFormat/DayTimeFormat';

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
    return (
      <div className="flex items-center justify-center py-8">
        <Spin />
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        type="error"
        message={error}
        showIcon
        className="border-2 border-red-300"
      />
    );
  }

  if (!session) {
    return (
      <div className="bg-yellow-50 border-2 border-yellow-400 p-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-yellow-600" />
          <div>
            <p className="font-bold text-yellow-800">
              {t('instructor.classes.sessionManager.notFound', 'Session Not Found')}
            </p>
            <p className="text-sm text-yellow-700">
              {t('instructor.classes.sessionManager.notFoundDesc', 'This activity does not have an active session configuration for this class yet.')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-2 border-black overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-blue-50 border-b-2 border-black flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="font-black text-black uppercase text-sm">
          {t('instructor.classes.sessionManager.title') || 'Session Availability'}
        </h3>
      </div>

      {/* Current Session Info */}
      {session.startTime && session.endTime && (
        <div className="px-4 py-3 bg-neutral-50 border-b border-neutral-200">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-600">{t('common.from', 'Từ')}:</span>
              <span className="font-bold text-black">
                <DayTimeFormat value={session.startTime} showTime />
              </span>
            </div>
            <span className="text-neutral-300">→</span>
            <div className="flex items-center gap-2">
              <span className="text-neutral-600">{t('common.to', 'Đến')}:</span>
              <span className="font-bold text-black">
                <DayTimeFormat value={session.endTime} showTime />
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            isActive: session.isActive,
            timeRange: session.startTime && session.endTime
              ? [dayjs(session.startTime), dayjs(session.endTime)]
              : []
          }}
        >
          <div className="flex flex-col lg:flex-row lg:items-start gap-4">
            {/* Status Toggle */}
            <Form.Item
              name="isActive"
              label={
                <span className="font-bold text-xs uppercase text-neutral-600 flex items-center gap-1">
                  <ToggleLeft className="w-4 h-4" />
                  {t('instructor.classes.sessionManager.status') || 'Access Status'}
                </span>
              }
              valuePropName="checked"
              className="mb-0"
            >
              <Switch
                checkedChildren={t('common.active') || 'Active'}
                unCheckedChildren={t('common.inactive') || 'Inactive'}
                className="[&.ant-switch-checked]:bg-green-500"
              />
            </Form.Item>

            {/* Time Range */}
            <Form.Item
              name="timeRange"
              label={
                <span className="font-bold text-xs uppercase text-neutral-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {t('instructor.classes.sessionManager.timeWindow') || 'Available Time Window'}
                </span>
              }
              className="flex-1 mb-0"
              help={
                <span className="text-xs text-neutral-500">
                  {t('instructor.classes.sessionManager.timeHelp') || 'Leave empty for unlimited time access while Active.'}
                </span>
              }
            >
              <RangePicker
                showTime={{ format: 'HH:mm' }}
                format="DD-MM-YYYY HH:mm"
                className="w-full border-2 border-neutral-300 hover:border-yellow-400 focus-within:border-yellow-500"
                placeholder={[
                  t('common.startTime', 'Start Time'),
                  t('common.endTime', 'End Time')
                ]}
                disabledDate={(current) => {
                  // Không cho chọn ngày trong quá khứ (trước hôm nay)
                  return current && current < dayjs().startOf('day');
                }}
              />
            </Form.Item>

            {/* Save Button */}
            <div className="lg:mt-6">
              <Button
                type="primary"
                htmlType="submit"
                loading={saving}
                className="bg-black hover:bg-neutral-800 border-2 border-black font-bold uppercase flex items-center gap-2 h-10"
              >
                <Save className="w-4 h-4" />
                {t('common.save') || 'Save'}
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default ActivitySessionManager;