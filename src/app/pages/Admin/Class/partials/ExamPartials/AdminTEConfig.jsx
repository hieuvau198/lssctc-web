import React, { useState, useEffect, useCallback } from 'react';
import { Table, Modal, Form, InputNumber, App, DatePicker, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { Edit3, FileText, Plus } from 'lucide-react';
import dayjs from 'dayjs';
import FinalExamApi from '../../../../../apis/FinalExam/FinalExamApi';
import PartialApi from '../../../../../apis/FinalExam/PartialApi';
import InstructorQuizApi from '../../../../../apis/Instructor/InstructorQuiz';
import { fetchClassDetail } from '../../../../../apis/ProgramManager/ClassApi';
import DayTimeFormat from '../../../../../components/DayTimeFormat/DayTimeFormat';

export default function AdminTEConfig({ classId, readOnly }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [classInfo, setClassInfo] = useState(null);
  
  const [form] = Form.useForm();
  
  // Watch fields for auto-calculation
  const startTime = Form.useWatch('startTime', form);
  const duration = Form.useWatch('duration', form);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await FinalExamApi.getClassExamConfig(classId);
      const teConfigs = response.partialConfigs?.filter(c => c.type === 'Theory') || [];
      setConfigs(teConfigs);
    } catch (error) {
      message.error('Failed to load TE config');
    } finally {
      setLoading(false);
    }
  }, [classId, message]);

  const fetchQuizzes = async () => {
    try {
      const res = await InstructorQuizApi.getQuizzes({ pageSize: 100 });
      setQuizzes(res.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchConfig();
      fetchQuizzes();
      // Fetch class details for date restriction
      fetchClassDetail(classId).then(data => setClassInfo(data)).catch(console.error);
    }
  }, [classId, fetchConfig]);

  // Auto-calculate End Time
  useEffect(() => {
    if (startTime && duration) {
      const end = dayjs(startTime).add(duration, 'minute');
      form.setFieldValue('endTime', end);
    }
  }, [startTime, duration, form]);

  const handleEdit = (record) => {
    setSelectedConfig(record);
    form.setFieldsValue({
      ...record,
      quizId: record.quizId,
      startTime: record.startTime ? dayjs(record.startTime) : null,
      endTime: record.endTime ? dayjs(record.endTime) : null
    });
    setCreateModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedConfig(null);
    form.resetFields();
    setCreateModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        classId: parseInt(classId),
        type: 'Theory',
        examWeight: values.examWeight,
        duration: values.duration,
        quizId: values.quizId,
        startTime: values.startTime?.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: values.endTime?.format('YYYY-MM-DDTHH:mm:ss'),
      };

      if (selectedConfig) {
        await PartialApi.updateClassPartialConfig(payload);
        message.success(t('admin.finalExam.updateSuccess', 'Configuration updated'));
      } else {
        await PartialApi.createClassPartial(payload);
        message.success(t('admin.finalExam.createSuccess', 'Configuration created'));
      }
      setCreateModalOpen(false);
      fetchConfig();
    } catch (err) {
      message.error(err.response?.data?.message || t('admin.finalExam.saveFailed', 'Failed to save'));
    }
  };

  const disabledDate = (current) => {
    if (!classInfo?.startDate) return false;
    return current && current < dayjs(classInfo.startDate).startOf('day');
  };

  const columns = [
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.quizName', 'Quiz Name')}</span>,
      key: 'name',
      render: (_, record) => (
        <div className="font-bold text-black uppercase flex items-center gap-2">
          <FileText className="w-4 h-4" />
          {record.quizName || 'Theory Exam'}
        </div>
      ),
    },
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.duration', 'Duration')}</span>,
      dataIndex: 'duration',
      align: 'center',
      render: (val) => <span className="font-bold">{val} min</span>,
    },
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.weight', 'Weight')}</span>,
      dataIndex: 'examWeight',
      align: 'center',
      render: (val) => <span className="font-bold">{val}%</span>,
    },
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.time', 'Time')}</span>,
      dataIndex: 'startTime',
      render: (val) => val ? <span className="text-neutral-600 font-mono text-xs"><DayTimeFormat value={val} showTime /></span> : '-',
    },
    {
      title: <span className="uppercase font-black text-xs">{t('common.action')}</span>,
      key: 'actions',
      width: 80,
      render: (_, record) => (
        <button
          onClick={() => handleEdit(record)}
          disabled={readOnly}
          className="w-8 h-8 border-2 border-black bg-white hover:bg-yellow-400 text-black flex items-center justify-center transition-all disabled:opacity-50 disabled:bg-neutral-100"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      {configs.length === 0 && !readOnly && (
        <div className="mb-4 flex justify-end">
          <button onClick={handleCreate} className="h-9 px-4 flex items-center gap-2 bg-yellow-400 text-black font-bold uppercase text-xs border-2 border-black hover:bg-yellow-500 transition-all">
            <Plus className="w-4 h-4" /> {t('admin.finalExam.createConfig', 'Create Config')}
          </button>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={configs}
        rowKey="type"
        loading={loading}
        pagination={false}
        className="border-2 border-neutral-200 [&_.ant-table-thead>tr>th]:bg-neutral-100 [&_.ant-table-thead>tr>th]:uppercase [&_.ant-table-thead>tr>th]:font-black [&_.ant-table-thead>tr>th]:text-xs"
      />

      <Modal
        title={<span className="font-black uppercase">{t('admin.finalExam.teConfig', 'Theory Exam Configuration')}</span>}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleSave}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
        okButtonProps={{ className: 'bg-black text-white font-bold uppercase' }}
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item name="quizId" label="Quiz" rules={[{ required: true }]}>
             <Select options={quizzes.map(q => ({ label: q.name, value: q.id }))} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration" label="Duration (min)" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name="examWeight" label="Weight (%)" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} className="w-full" disabled />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="startTime" label="Start Time" rules={[{ required: true }]}>
              <DatePicker 
                showTime 
                format="DD-MM-YYYY HH:mm" 
                className="w-full" 
                disabledDate={disabledDate}
              />
            </Form.Item>
            <Form.Item name="endTime" label="End Time">
              <DatePicker showTime format="DD-MM-YYYY HH:mm" className="w-full" disabled />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
}