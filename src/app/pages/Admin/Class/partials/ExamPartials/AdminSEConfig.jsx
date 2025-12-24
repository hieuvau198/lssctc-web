import React, { useState, useEffect, useCallback } from 'react';
import { Table, Modal, Form, InputNumber, App, DatePicker, Select } from 'antd';
import { useTranslation } from 'react-i18next';
import { Edit3, Monitor, Plus } from 'lucide-react';
import dayjs from 'dayjs';
import FinalExamApi from '../../../../../apis/FinalExam/FinalExamApi';
import PartialApi from '../../../../../apis/FinalExam/PartialApi';
import InstructorPracticeApi from '../../../../../apis/Instructor/InstructorPractice';
import DayTimeFormat from '../../../../../components/DayTimeFormat/DayTimeFormat';

export default function AdminSEConfig({ classId, readOnly }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [practices, setPractices] = useState([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [form] = Form.useForm();

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await FinalExamApi.getClassExamConfig(classId);
      const seConfigs = response.partialConfigs?.filter(c => c.type === 'Simulation') || [];
      setConfigs(seConfigs);
    } catch (error) {
      message.error('Failed to load SE config');
    } finally {
      setLoading(false);
    }
  }, [classId, message]);

  const fetchPractices = async () => {
    try {
      const res = await InstructorPracticeApi.getPractices({ pageSize: 100 });
      setPractices(res.items || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (classId) {
      fetchConfig();
      fetchPractices();
    }
  }, [classId, fetchConfig]);

  const handleEdit = (record) => {
    setSelectedConfig(record);
    form.setFieldsValue({
      ...record,
      practiceId: record.practiceId,
      timeRange: [record.startTime ? dayjs(record.startTime) : null, record.endTime ? dayjs(record.endTime) : null]
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
        type: 'Simulation',
        examWeight: values.examWeight,
        duration: values.duration,
        practiceId: values.practiceId,
        startTime: values.timeRange?.[0]?.format('YYYY-MM-DDTHH:mm:ss'),
        endTime: values.timeRange?.[1]?.format('YYYY-MM-DDTHH:mm:ss'),
      };

      if (selectedConfig) await PartialApi.updateClassPartialConfig(payload);
      else await PartialApi.createClassPartial(payload);

      message.success(t('admin.finalExam.saveSuccess', 'Saved successfully'));
      setCreateModalOpen(false);
      fetchConfig();
    } catch (err) {
      message.error(t('admin.finalExam.saveFailed', 'Save failed'));
    }
  };

  const columns = [
    {
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.practiceName', 'Practice Name')}</span>,
      key: 'name',
      render: (_, record) => (
        <div className="font-bold text-black uppercase flex items-center gap-2">
          <Monitor className="w-4 h-4" />
          {record.practiceName || 'Simulation Exam'}
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
      title: <span className="uppercase font-black text-xs">{t('admin.finalExam.time', 'Time Range')}</span>,
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
          className="w-8 h-8 border-2 border-black bg-white hover:bg-yellow-400 text-black flex items-center justify-center transition-all disabled:opacity-50"
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
        title={<span className="font-black uppercase">{t('admin.finalExam.seConfig', 'Simulation Exam Configuration')}</span>}
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        onOk={handleSave}
        okButtonProps={{ className: 'bg-black text-white font-bold uppercase' }}
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item name="practiceId" label="Practice" rules={[{ required: true }]}>
            <Select options={practices.map(p => ({ label: p.practiceName, value: p.id }))} />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration" label="Duration (min)" rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name="examWeight" label="Weight (%)" rules={[{ required: true }]}>
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item name="timeRange" label="Time Range" rules={[{ required: true }]}>
            <DatePicker.RangePicker showTime format="DD-MM-YYYY HH:mm" className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}