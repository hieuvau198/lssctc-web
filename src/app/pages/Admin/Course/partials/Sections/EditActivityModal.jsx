// src/app/pages/Admin/Course/partials/Sections/EditActivityModal.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Form, Input, InputNumber, Select, message } from 'antd';
import { 
  updateActivity,
  fetchAllQuizzes,
  fetchQuizzesByActivity,
  assignQuizToActivity,
  removeQuizFromActivity 
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
  
  // Watch activity type to conditionally show Material/Quiz Select
  const activityType = Form.useWatch('activityType', form);

  useEffect(() => {
    if (visible && activity) {
      // 1. Set basic activity fields
      form.setFieldsValue({
        activityTitle: activity.activityTitle || activity.title,
        activityDescription: activity.activityDescription || activity.description,
        activityType: activity.activityType || activity.type,
        estimatedDurationMinutes: activity.estimatedDurationMinutes || activity.duration
      });

      // 2. Fetch Resources Data (Materials & Quizzes)
      fetchResourcesData();
    } else {
      form.resetFields();
      setInitialMaterialId(null);
      setMaterials([]);
      setInitialQuizId(null);
      setQuizzes([]);
    }
  }, [visible, activity, form]);

  const fetchResourcesData = async () => {
    try {
      // --- MATERIALS ---
      const materialsResp = await getMaterials({ page: 1, pageSize: 1000 });
      setMaterials(materialsResp.items || []);

      const attachedMaterials = await getMaterialsByActivityId(activity.id);
      if (attachedMaterials && attachedMaterials.length > 0) {
        const currentMatId = attachedMaterials[0].id;
        setInitialMaterialId(currentMatId);
        // Only set the field if the type matches to avoid confusion
        if (activity.activityType === 'Material' || !activity.activityType) {
             form.setFieldValue('materialId', currentMatId);
        }
      } else {
        setInitialMaterialId(null);
        form.setFieldValue('materialId', null);
      }

      // --- QUIZZES ---
      const quizzesList = await fetchAllQuizzes();
      setQuizzes(quizzesList || []);

      const attachedQuizzes = await fetchQuizzesByActivity(activity.id);
      if (attachedQuizzes && attachedQuizzes.length > 0) {
        const currentQuizId = attachedQuizzes[0].id;
        setInitialQuizId(currentQuizId);
        if (activity.activityType === 'Quiz') {
            form.setFieldValue('quizId', currentQuizId);
        }
      } else {
        setInitialQuizId(null);
        form.setFieldValue('quizId', null);
      }

    } catch (error) {
      console.error("Error loading resources:", error);
      message.error("Failed to load attached resources information");
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

      message.success('Activity updated successfully');
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || 'Failed to update activity');
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
            <h3 className="text-white font-black uppercase text-lg leading-none m-0">Edit Activity</h3>
            <p className="text-neutral-400 text-xs font-mono mt-1 m-0">ID: {activity?.id}</p>
          </div>
        </div>
        <button onClick={onCancel} className="text-neutral-400 hover:text-white transition-colors">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="p-6">
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name="activityTitle" label="Activity Title" rules={[{ required: true }]}>
            <Input className="h-10 border-2 border-neutral-200 rounded-none focus:border-yellow-400" />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="activityType" label="Type" rules={[{ required: true }]}>
              <Select className="h-10 border-2 border-neutral-200 rounded-none">
                <Option value="Material">Material</Option>
                <Option value="Quiz">Quiz</Option>
                <Option value="Practice">Practice</Option>
              </Select>
            </Form.Item>
            <Form.Item name="estimatedDurationMinutes" label="Duration (Mins)" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full h-10 border-2 border-neutral-200 rounded-none flex items-center" />
            </Form.Item>
          </div>

          {/* Conditional Material Select */}
          {activityType === 'Material' && (
             <Form.Item name="materialId" label="Assign Material">
                <Select 
                  placeholder="Select a material to assign"
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
             <Form.Item name="quizId" label="Assign Quiz">
                <Select 
                  placeholder="Select a quiz to assign"
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

          <Form.Item name="activityDescription" label="Description">
            <Input.TextArea rows={3} className="border-2 border-neutral-200 rounded-none focus:border-yellow-400" />
          </Form.Item>

          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100 mt-6">
            <button type="button" onClick={onCancel} className="px-5 py-2.5 bg-white border-2 border-neutral-300 text-neutral-600 font-bold uppercase tracking-wider hover:border-black text-xs">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-5 py-2.5 bg-yellow-400 border-2 border-yellow-400 text-black font-black uppercase tracking-wider hover:bg-yellow-500 text-xs flex items-center gap-2">
              {loading && <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />}
              Save Changes
            </button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default EditActivityModal;