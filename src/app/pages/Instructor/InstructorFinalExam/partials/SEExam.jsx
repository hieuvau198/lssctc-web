import { Table, Button, Tag, Space, Modal, Form, InputNumber, App, DatePicker } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import InstructorFEApi from '../../../../apis/Instructor/InstructorFEApi';

export default function SEExam({ classId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [studentExams, setStudentExams] = useState([]);
  const [form] = Form.useForm();

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await InstructorFEApi.getClassConfig(classId);
      setConfigs(response.data?.partialConfigs?.filter(c => c.type === 'Simulation') || []);
    } catch (error) {
      message.error('Failed to load SE config');
    } finally {
      setLoading(false);
    }
  }, [classId, message]);

  useEffect(() => { if (classId) fetchConfig(); }, [classId, fetchConfig]);

  const handleView = async (config) => {
    setSelectedConfig(config);
    setViewModalOpen(true);
    const res = await InstructorFEApi.getByClass(classId);
    setStudentExams(res.data || []);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        classId: parseInt(classId),
        type: 'Simulation',
        examWeight: values.examWeight,
        duration: values.duration,
        startTime: values.timeRange?.[0]?.toISOString(),
        endTime: values.timeRange?.[1]?.toISOString(),
      };

      if (selectedConfig) await InstructorFEApi.updateClassPartialConfig(payload);
      else await InstructorFEApi.createClassPartial(payload);
      
      message.success('Success');
      setCreateModalOpen(false);
      fetchConfig();
    } catch (err) {
      message.error('Failed');
    }
  };

  const columns = [
    {
      title: t('instructor.finalExam.examName'),
      key: 'name',
      render: (_, record) => <a onClick={() => handleView(record)} className="text-blue-600">Simulation Exam</a>,
    },
    { title: 'Duration (min)', dataIndex: 'duration', align: 'center' },
    { title: 'Weight (%)', dataIndex: 'examWeight', align: 'center' },
    {
      title: t('common.actions'),
      render: (_, record) => <Button type="link" icon={<EditOutlined />} onClick={() => {
        setSelectedConfig(record);
        form.setFieldsValue({ ...record, timeRange: [record.startTime ? dayjs(record.startTime) : null, record.endTime ? dayjs(record.endTime) : null] });
        setCreateModalOpen(true);
      }} />,
    },
  ];

  const studentColumns = [
    { title: 'Trainee', dataIndex: 'traineeName' },
    { title: 'Code', dataIndex: 'traineeCode' },
    { 
      title: 'Score', 
      render: (_, r) => r.partials?.find(p => p.type === 'Simulation')?.marks ?? '-' 
    },
    {
      title: 'Status',
      render: (_, r) => <Tag>{r.partials?.find(p => p.type === 'Simulation')?.status || 'Pending'}</Tag>
    }
  ];

  return (
    <div className="py-4">
      <div className="mb-4 flex justify-between">
        <span className="text-lg font-bold">{t('instructor.finalExam.seTitle')}</span>
        {configs.length === 0 && <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedConfig(null); form.resetFields(); setCreateModalOpen(true); }}>Create</Button>}
      </div>
      <Table columns={columns} dataSource={configs} rowKey="type" pagination={false} loading={loading} />
      
      <Modal open={createModalOpen} onOk={handleSave} onCancel={() => setCreateModalOpen(false)} title="Config SE">
        <Form form={form} layout="vertical">
          <Form.Item name="duration" label="Duration" rules={[{ required: true }]}><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="examWeight" label="Weight" rules={[{ required: true }]}><InputNumber className="w-full" /></Form.Item>
          <Form.Item name="timeRange" label="Time"><DatePicker.RangePicker showTime className="w-full" /></Form.Item>
        </Form>
      </Modal>

      <Modal open={viewModalOpen} onCancel={() => setViewModalOpen(false)} footer={null} width={700} title="Student Details">
        <Table dataSource={studentExams} columns={studentColumns} rowKey="id" />
      </Modal>
    </div>
  );
}