import { Table, Button, Tag, Space, Modal, Form, InputNumber, App, DatePicker, Select } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, EditOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import InstructorFEApi from '../../../../apis/Instructor/InstructorFEApi';
import InstructorPracticeApi from '../../../../apis/Instructor/InstructorPractice';

export default function SEExam({ classId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [studentExams, setStudentExams] = useState([]);
  
  // Data for Selects
  const [practices, setPractices] = useState([]);

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

  // Load Practices for Dropdown
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
        practiceId: values.practiceId, // Link to Practice
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
      render: (_, record) => (
        <a onClick={() => handleView(record)} className="font-medium text-blue-600 hover:underline">
          {record.practiceName || 'Simulation Exam'}
        </a>
      ),
    },
    { title: 'Duration (min)', dataIndex: 'duration', align: 'center' },
    { title: 'Weight (%)', dataIndex: 'examWeight', align: 'center' },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: t('common.actions'),
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => {
          setSelectedConfig(record);
          form.setFieldsValue({ 
            ...record, 
            practiceId: record.practiceId,
            timeRange: [record.startTime ? dayjs(record.startTime) : null, record.endTime ? dayjs(record.endTime) : null] 
          });
          setCreateModalOpen(true);
        }} />
      ),
    },
  ];

  const studentColumns = [
    { title: 'Trainee', dataIndex: 'traineeName' },
    { title: 'Code', dataIndex: 'traineeCode' },
    { 
      title: 'Score', 
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Simulation');
        return p?.marks !== null ? <Tag color="blue">{p.marks}</Tag> : '-';
      }
    },
    {
      title: 'Result',
      render: (_, r) => {
         const p = r.partials?.find(p => p.type === 'Simulation');
         if (!p) return '-';

         if (p.status === 'NotYet') return <Tag color="default">Not Yet</Tag>;

         if (p.isPass === true) return <Tag color="success">PASS</Tag>;
         if (p.isPass === false) return <Tag color="error">FAIL</Tag>;
         return '-';
      }
    },
    {
      title: 'Status',
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Simulation');
        let statusText = p?.status || 'Pending';
        let color = 'default';

        if (p?.status === 'Approved') color = 'green';
        else if (p?.status === 'Submitted') color = 'orange';

        if (statusText === 'NotYet') statusText = 'Not Yet';
        
        return <Tag color={color}>{statusText}</Tag>;
      }
    }
  ];

  return (
    <div className="py-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
           <span className="text-lg font-bold">{t('instructor.finalExam.seTitle')}</span>
        </div>
        {configs.length === 0 && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => { setSelectedConfig(null); form.resetFields(); setCreateModalOpen(true); }}>
            {t('instructor.finalExam.createExam')}
          </Button>
        )}
      </div>
      <Table columns={columns} dataSource={configs} rowKey="type" pagination={false} loading={loading} />
      
      <Modal open={createModalOpen} onOk={handleSave} onCancel={() => setCreateModalOpen(false)} title="Config SE">
        <Form form={form} layout="vertical">
          <Form.Item name="practiceId" label="Select Practice" rules={[{ required: true }]}>
             <Select 
                options={practices.map(p => ({ label: p.practiceName, value: p.id }))} 
                placeholder="Choose a practice"
             />
           </Form.Item>
          <Form.Item name="duration" label="Duration" rules={[{ required: true }]}><InputNumber min={1} className="w-full" /></Form.Item>
          <Form.Item name="examWeight" label="Weight" rules={[{ required: true }]}><InputNumber min={0} max={100} className="w-full" /></Form.Item>
          <Form.Item name="timeRange" label="Time"><DatePicker.RangePicker showTime className="w-full" /></Form.Item>
        </Form>
      </Modal>

      <Modal open={viewModalOpen} onCancel={() => setViewModalOpen(false)} footer={null} width={700} title="Student Details">
        <Table dataSource={studentExams} columns={studentColumns} rowKey="id" />
      </Modal>
    </div>
  );
}