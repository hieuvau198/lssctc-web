import React, { useEffect, useState, useCallback } from 'react';
import {
  Modal, Form, Input, InputNumber, Select, App
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
      title={null}
      open={visible}
      onCancel={onCancel}
      closeIcon={null}
      width={600}
      centered
      footer={null}
      className="industrial-practice-modal"
      styles={{
        content: {
          padding: 0,
          borderRadius: 0,
          border: '2px solid #000',
          overflow: 'hidden'
        }
      }}
    >
      <div className="bg-white">
        {/* Industrial Header */}
        <div className="bg-black p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <h3 className="text-white font-black uppercase text-lg tracking-wider">
              {t('simManager.practiceDetailPartials.updatePractice')}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="w-8 h-8 flex items-center justify-center text-white hover:text-yellow-400 hover:bg-neutral-800 transition-all"
          >
            <span className="text-2xl font-bold leading-none">&times;</span>
          </button>
        </div>

        {/* Yellow Accent Bar */}
        <div className="h-1 bg-yellow-400 w-full" />

        {/* Form Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          <style>{`
            .industrial-practice-form .ant-form-item-label label {
              font-weight: 700 !important;
              text-transform: uppercase !important;
              font-size: 0.75rem !important;
              letter-spacing: 0.05em !important;
              color: #525252 !important;
            }
            .industrial-practice-form .ant-form-item-label label::before {
              color: #ef4444 !important;
            }
            .industrial-practice-form .ant-input,
            .industrial-practice-form .ant-input-textarea textarea,
            .industrial-practice-form .ant-input-number,
            .industrial-practice-form .ant-select-selector {
              border: 2px solid #e5e5e5 !important;
              border-radius: 0 !important;
              font-weight: 500 !important;
              background-color: #fafafa !important;
              transition: all 0.2s ease !important;
            }
            .industrial-practice-form .ant-input:focus,
            .industrial-practice-form .ant-input-textarea textarea:focus,
            .industrial-practice-form .ant-input-number:focus,
            .industrial-practice-form .ant-input-number-focused,
            .industrial-practice-form .ant-input:hover,
            .industrial-practice-form .ant-input-textarea textarea:hover,
            .industrial-practice-form .ant-input-number:hover,
            .industrial-practice-form .ant-select-selector:hover,
            .industrial-practice-form .ant-select-focused .ant-select-selector {
              border-color: #000 !important;
              background-color: #fff !important;
              box-shadow: none !important;
            }
            .industrial-practice-form .ant-input-number {
              width: 100% !important;
            }
            .industrial-practice-form .ant-input-number-input {
              padding: 8px 12px !important;
            }
            .industrial-practice-form .ant-select-selector {
              height: 44px !important;
              padding: 6px 12px !important;
            }
            .industrial-practice-form .ant-select-selection-item {
              line-height: 30px !important;
            }
            .industrial-practice-form .ant-input-textarea-show-count::after {
              font-size: 0.7rem !important;
              color: #a3a3a3 !important;
              font-family: monospace !important;
            }
          `}</style>

          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={initialValues}
            className="industrial-practice-form"
          >
            <Form.Item
              name="practiceName"
              label={t('simManager.practiceDetailPartials.practiceName')}
              rules={[{ required: true, message: t('simManager.practiceDetailPartials.practiceNameRequired') }]}
            >
              <Input
                placeholder={t('simManager.practiceDetailPartials.practiceNamePlaceholder')}
                maxLength={200}
                showCount
                className="h-11"
              />
            </Form.Item>
            <Form.Item
              name="practiceCode"
              label={t('simManager.practiceDetailPartials.practiceCode')}
            >
              <Input
                placeholder={t('simManager.practiceDetailPartials.practiceCodePlaceholder')}
                maxLength={50}
                showCount
                className="h-11 font-mono"
              />
            </Form.Item>
            <Form.Item
              name="practiceDescription"
              label={t('simManager.practiceDetailPartials.practiceDescription')}
            >
              <Input.TextArea
                rows={3}
                placeholder={t('simManager.practiceDetailPartials.practiceDescriptionPlaceholder')}
                maxLength={1000}
                showCount
                className="resize-none"
              />
            </Form.Item>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="estimatedDurationMinutes"
                label={t('simManager.practiceDetailPartials.estimatedDuration')}
                rules={[{ type: 'number', min: 1, max: 600 }]}
              >
                <InputNumber min={1} max={600} className="!w-full h-11" />
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
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                name="maxAttempts"
                label={t('simManager.practiceDetailPartials.maxAttempts')}
                rules={[{ type: 'number', min: 1, max: 10 }]}
              >
                <InputNumber min={1} max={10} className="!w-full h-11" />
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
            </div>
          </Form>
        </div>

        {/* Industrial Footer */}
        <div className="p-4 bg-neutral-50 border-t-2 border-neutral-200 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 bg-white text-neutral-700 font-bold uppercase tracking-wider text-sm border-2 border-neutral-300 hover:bg-neutral-100 hover:border-neutral-400 transition-all"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={() => form.submit()}
            disabled={loading}
            className="px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {t('common.edit')}
          </button>
        </div>
      </div>
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
      <div className="h-[calc(100vh-64px)] flex flex-col p-6 bg-neutral-100">
        <div className="bg-white border-2 border-black overflow-hidden">
          <div className="h-1 bg-yellow-400" />
          <div className="p-6">
            <div className="flex justify-center py-16">
              <div className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
            <p className="text-center text-neutral-500 font-bold uppercase tracking-wider">
              {t('simManager.practiceDetailPartials.loadingDetails')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[calc(100vh-64px)] flex flex-col p-6 bg-neutral-100">
        <div className="bg-white border-2 border-red-500 overflow-hidden">
          <div className="h-1 bg-red-500" />
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-500 border-2 border-black flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="font-black text-red-600 uppercase tracking-tight text-lg">{t('common.error')}</h3>
            </div>
            <p className="text-neutral-600 font-medium">{error}</p>
          </div>
        </div>
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
    <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden">
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

      {/* Industrial Header */}
      <div className="flex-none bg-black border-2 border-black p-5 mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
        <div className="h-1 bg-yellow-400 -mx-5 -mt-5 mb-4" />
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center hover:bg-yellow-400 transition-all hover:scale-105 shadow-[2px_2px_0px_0px_rgba(255,255,255,0.2)]"
          >
            <ArrowLeft className="w-5 h-5 text-black" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {t('simManager.practiceDetailPartials.title')}
            </h1>
            <p className="text-yellow-400 text-sm mt-1 font-medium">
              {practice.practiceName}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto pr-2 pb-4 space-y-6">

        {/* Practice Information Card - Industrial Style */}
        <div className="mb-6">
          <div className="bg-white border-2 border-black overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            {/* Yellow Accent Bar */}
            <div className="h-1 bg-yellow-400" />

            {/* Header */}
            <div className="px-6 py-4 border-b-2 border-neutral-200 bg-neutral-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h2 className="font-black text-black uppercase tracking-tight text-lg">
                  {t('simManager.practiceDetailPartials.practiceInfo')}
                </h2>
              </div>
              <button
                onClick={handleEditPractice}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-black font-bold uppercase tracking-wider text-sm border-2 border-black hover:bg-yellow-500 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              >
                <EditOutlined />
                {t('simManager.practiceDetailPartials.editPractice')}
              </button>
            </div>

            {/* Content Grid */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Practice Name - Full Width */}
                <div className="md:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {t('simManager.practiceDetailPartials.practiceName')}
                  </div>
                  <div className="text-lg font-bold text-black">
                    {practice.practiceName}
                  </div>
                </div>

                {/* Practice Code - Full Width */}
                <div className="md:col-span-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {t('simManager.practiceDetailPartials.practiceCode')}
                  </div>
                  <div className="font-mono text-base font-bold bg-neutral-100 border-2 border-neutral-200 px-3 py-1.5 inline-block">
                    {practice.practiceCode}
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {t('simManager.practiceDetailPartials.duration')}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-black text-black">{practice.estimatedDurationMinutes}</span>
                    <span className="text-sm text-neutral-500 font-medium">{t('simManager.practiceDetailPartials.minutes')}</span>
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {t('simManager.practiceDetailPartials.difficulty')}
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 border-2 border-black font-bold uppercase text-sm ${practice.difficultyLevel === 'Entry' ? 'bg-green-400 text-black' :
                    practice.difficultyLevel === 'Intermediate' ? 'bg-yellow-400 text-black' :
                      practice.difficultyLevel === 'Advanced' ? 'bg-red-500 text-white' :
                        'bg-neutral-200 text-black'
                    }`}>
                    {getDifficultyLabel(practice.difficultyLevel)}
                  </span>
                </div>

                {/* Max Attempts */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {t('simManager.practiceDetailPartials.maxAttempts')}
                  </div>
                  <div className="text-xl font-black text-black">{practice.maxAttempts}</div>
                </div>

                {/* Status */}
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {t('simManager.practiceDetailPartials.status')}
                  </div>
                  <span className={`inline-flex items-center px-3 py-1 border-2 border-black font-bold uppercase text-sm ${practice.isActive ? 'bg-green-400 text-black' : 'bg-neutral-200 text-neutral-600'
                    }`}>
                    {practice.isActive ? t('simManager.practiceDetailPartials.active') : t('simManager.practiceDetailPartials.inactive')}
                  </span>
                </div>

                {/* Description - Full Width */}
                <div className="md:col-span-2 pt-2 border-t-2 border-neutral-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-1">
                    {t('simManager.practiceDetailPartials.practiceDescription')}
                  </div>
                  <div className="text-neutral-700 font-medium leading-relaxed">
                    {practice.practiceDescription || (
                      <span className="text-neutral-400 italic">{t('common.na')}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tasks Section */}
        <div>
          <PracticeTaskList practiceId={id} />
        </div>
      </div>
    </div>
  );
}
