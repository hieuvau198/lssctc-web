// src/app/pages/Admin/Course/partials/Sections/EditActivityModal.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import {
  updateActivity,
  fetchAllQuizzes,
  fetchQuizzesByActivity,
  assignQuizToActivity,
  removeQuizFromActivity,
  fetchAllPractices,
  fetchPracticesByActivity,
  assignPracticeToActivity,
  removePracticeFromActivity
} from '../../../../../apis/ProgramManager/SectionApi';
import {
  getMaterials,
  getMaterialsByActivityId,
  assignMaterialToActivity,
  removeMaterialFromActivity
} from '../../../../../apis/Instructor/InstructorMaterialsApi';
import { FileEdit, X } from 'lucide-react';

const { Option } = Select;

const EditActivityModal = ({ visible, onCancel, onSuccess, activity }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  // State for Material Management
  const [materials, setMaterials] = useState([]);
  const [initialMaterialId, setInitialMaterialId] = useState(null);

  // State for Quiz Management
  const [quizzes, setQuizzes] = useState([]);
  const [initialQuizId, setInitialQuizId] = useState(null);

  // State for Practice Management
  const [practices, setPractices] = useState([]);
  const [initialPracticeId, setInitialPracticeId] = useState(null);

  // Watch activity type to conditionally show Material/Quiz/Practice Select
  const activityType = Form.useWatch('activityType', form);

  // 1. Initialize Form on Visible/Activity Change
  useEffect(() => {
    if (visible && activity) {
      // Set basic activity fields
      form.setFieldsValue({
        activityTitle: activity.activityTitle || activity.title,
        activityDescription: activity.activityDescription || activity.description,
        activityType: activity.activityType || activity.type,
        estimatedDurationMinutes: activity.estimatedDurationMinutes || activity.duration
      });

      // Note: We do NOT call fetchResourcesData here anymore.
      // The second useEffect watching 'activityType' will trigger the specific fetch.
    } else {
      form.resetFields();
      setInitialMaterialId(null);
      setMaterials([]);
      setInitialQuizId(null);
      setQuizzes([]);
      setInitialPracticeId(null);
      setPractices([]);
    }
  }, [visible, activity, form]);

  // 2. Fetch Data specifically when Activity Type is set or changes
  useEffect(() => {
    if (visible && activity && activityType) {
      fetchResourcesData(activityType);
    }
  }, [activityType, visible, activity]);

  const fetchResourcesData = async (type) => {
    try {
      // --- MATERIALS ---
      if (type === 'Material') {
        // Only fetch materials if list is empty or strictly necessary
        if (materials.length === 0) {
          const materialsResp = await getMaterials({ page: 1, pageSize: 1000 });
          setMaterials(materialsResp.items || []);
        }

        const attachedMaterials = await getMaterialsByActivityId(activity.id);
        if (attachedMaterials && attachedMaterials.length > 0) {
          // FIX: Use learningMaterialId (the actual material ID) instead of id (the assignment ID)
          const currentMatId = attachedMaterials[0].learningMaterialId;
          setInitialMaterialId(currentMatId);

          if (form.getFieldValue('activityType') === 'Material') {
            form.setFieldValue('materialId', currentMatId);
          }
        } else {
          setInitialMaterialId(null);
          form.setFieldValue('materialId', null);
        }
      }

      // --- QUIZZES ---
      else if (type === 'Quiz') {
        if (quizzes.length === 0) {
          const quizzesList = await fetchAllQuizzes();
          setQuizzes(quizzesList || []);
        }

        const attachedQuizzes = await fetchQuizzesByActivity(activity.id);
        if (attachedQuizzes && attachedQuizzes.length > 0) {
          const currentQuizId = attachedQuizzes[0].id;
          setInitialQuizId(currentQuizId);
          if (form.getFieldValue('activityType') === 'Quiz') {
            form.setFieldValue('quizId', currentQuizId);
          }
        } else {
          setInitialQuizId(null);
          form.setFieldValue('quizId', null);
        }
      }

      // --- PRACTICES ---
      else if (type === 'Practice') {
        if (practices.length === 0) {
          const practicesList = await fetchAllPractices();
          setPractices(practicesList || []);
        }

        const attachedPractices = await fetchPracticesByActivity(activity.id);
        if (attachedPractices && attachedPractices.length > 0) {
          const currentPracticeId = attachedPractices[0].id;
          setInitialPracticeId(currentPracticeId);
          if (form.getFieldValue('activityType') === 'Practice') {
            form.setFieldValue('practiceId', currentPracticeId);
          }
        } else {
          setInitialPracticeId(null);
          form.setFieldValue('practiceId', null);
        }
      }

    } catch (error) {
      console.error("Error loading resources:", error);
      message.error(t('admin.courses.sections.activities.loadResourceError'));
    }
  };

  const handleSubmit = async (values) => {
    if (!activity?.id) return;
    setLoading(true);
    try {
      // 1. Update basic Activity details
      await updateActivity(activity.id, {
        activityTitle: values.activityTitle,
        activityDescription: values.activityDescription,
        activityType: values.activityType,
        estimatedDurationMinutes: values.estimatedDurationMinutes
      });

      // 2. Handle Material Assignment
      if (values.activityType === 'Material') {
        const newMaterialId = values.materialId;
        if (initialMaterialId !== newMaterialId) {
          // Use initialMaterialId which now correctly holds the learningMaterialId
          if (initialMaterialId) await removeMaterialFromActivity(activity.id, initialMaterialId);
          if (newMaterialId) await assignMaterialToActivity(activity.id, newMaterialId);
        }
      }

      // 3. Handle Quiz Assignment
      if (values.activityType === 'Quiz') {
        const newQuizId = values.quizId;
        if (initialQuizId !== newQuizId) {
          if (initialQuizId) await removeQuizFromActivity(activity.id, initialQuizId);
          if (newQuizId) await assignQuizToActivity(activity.id, newQuizId);
        }
      }

      // 4. Handle Practice Assignment
      if (values.activityType === 'Practice') {
        const newPracticeId = values.practiceId;
        if (initialPracticeId !== newPracticeId) {
          if (initialPracticeId) await removePracticeFromActivity(activity.id, initialPracticeId);
          if (newPracticeId) await assignPracticeToActivity(activity.id, newPracticeId);
        }
      }

      message.success(t('admin.courses.sections.activities.updateSuccess'));
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || t('admin.courses.sections.activities.updateError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      footer={null}
      closable={false}
      width={600}
      styles={{ content: { padding: 0, borderRadius: 0 }, body: { padding: 0 } }}
    >
      <div className="bg-black p-4 flex items-center justify-between border-b-4 border-yellow-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
            <FileEdit className="w-5 h-5 text-black" />
          </div>
          <div>
            <h3 className="text-white font-black uppercase text-lg leading-none m-0">{t('admin.courses.sections.activities.editActivity')}</h3>
            <p className="text-neutral-400 text-xs font-mono mt-1 m-0">ID: {activity?.id}</p>
          </div>
        </div>
        <button onClick={onCancel} className="text-neutral-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="activityTitle" label={t('admin.courses.sections.activities.form.title')} rules={[{ required: true, message: t('admin.courses.sections.activities.form.titleRequired') }]}>
            <Input className="h-10 border-2 border-neutral-200 rounded-none focus:border-yellow-400" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="activityType" label={t('admin.courses.sections.activities.form.type')} rules={[{ required: true }]}>
              <Select className="h-10 border-2 border-neutral-200 rounded-none">
                <Option value="Material">Material</Option>
                <Option value="Quiz">Quiz</Option>
                <Option value="Practice">Practice</Option>
              </Select>
            </Form.Item>
            <Form.Item name="estimatedDurationMinutes" label={t('admin.courses.sections.activities.form.duration')} rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full h-10 border-2 border-neutral-200 rounded-none flex items-center" />
            </Form.Item>
          </div>

          {/* Conditional Material Select */}
          {activityType === 'Material' && (
            <Form.Item name="materialId" label={t('admin.courses.sections.activities.form.assignMaterial')}>
              <Select
                placeholder={t('admin.courses.sections.activities.form.selectMaterial')}
                allowClear
                showSearch
                optionFilterProp="children"
                className="h-10 border-2 border-neutral-200 rounded-none"
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {materials.map(m => (
                  <Option key={m.id} value={m.id}>
                    {m.name} {m.learningMaterialType ? `(${m.learningMaterialType})` : ''}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Conditional Quiz Select */}
          {activityType === 'Quiz' && (
            <Form.Item name="quizId" label={t('admin.courses.sections.activities.form.assignQuiz')}>
              <Select
                placeholder={t('admin.courses.sections.activities.form.selectQuiz')}
                allowClear
                showSearch
                optionFilterProp="children"
                className="h-10 border-2 border-neutral-200 rounded-none"
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {quizzes.map(q => (
                  <Option key={q.id} value={q.id}>
                    {q.name} ({q.totalScore} pts)
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          {/* Conditional Practice Select */}
          {activityType === 'Practice' && (
            <Form.Item name="practiceId" label={t('admin.courses.sections.activities.form.assignPractice')}>
              <Select
                placeholder={t('admin.courses.sections.activities.form.selectPractice')}
                allowClear
                showSearch
                optionFilterProp="children"
                className="h-10 border-2 border-neutral-200 rounded-none"
                filterOption={(input, option) =>
                  (option?.children ?? '').toLowerCase().includes(input.toLowerCase())
                }
              >
                {practices.map(p => (
                  <Option key={p.id} value={p.id}>
                    {p.practiceName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item name="activityDescription" label={t('admin.courses.sections.activities.form.description')}>
            <Input.TextArea rows={3} className="border-2 border-neutral-200 rounded-none focus:border-yellow-400" />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-white border-2 border-neutral-300 text-neutral-600 font-bold uppercase tracking-wider hover:border-black text-xs">
              {t('common.cancel')}
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-yellow-400 border-2 border-yellow-400 text-black font-black uppercase tracking-wider hover:bg-yellow-500 text-xs flex items-center gap-2">
              {loading && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              {t('admin.courses.sections.activities.form.saveChanges')}
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditActivityModal;