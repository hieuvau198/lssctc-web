import { Table, Button, Tag, Space, Modal, Form, InputNumber, App, DatePicker, Select } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import InstructorFEApi from '../../../../apis/Instructor/InstructorFEApi';
import InstructorQuizApi from '../../../../apis/Instructor/InstructorQuiz';

export default function TEExam({ classId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]); 
  
  // Modal States
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);
  const [studentExams, setStudentExams] = useState([]);
  
  // Data for Selects
  const [quizzes, setQuizzes] = useState([]);

  const [form] = Form.useForm();

  // Load Class Config (The "Exams" list)
  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await InstructorFEApi.getClassConfig(classId);
      // Filter for Theory type
      const teConfigs = response.data?.partialConfigs?.filter(c => c.type === 'Theory') || [];
      setConfigs(teConfigs);
    } catch (error) {
      console.error(error);
      message.error('Failed to load exam configurations');
    } finally {
      setLoading(false);
    }
  }, [classId, message]);

  // Load Quizzes for Dropdown
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
    }
  }, [classId, fetchConfig]);

  // Handle View (Load Student List with Codes)
  const handleView = async (config) => {
    setSelectedConfig(config);
    setViewModalOpen(true);
    setLoading(true);
    try {
      const res = await InstructorFEApi.getByClass(classId);
      setStudentExams(res.data || []);
    } catch (error) {
      message.error('Failed to load student exams');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setSelectedConfig(null);
    form.resetFields();
    setCreateModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedConfig(record);
    form.setFieldsValue({
      ...record,
      quizId: record.quizId,
      timeRange: [
        record.startTime ? dayjs(record.startTime) : null,
        record.endTime ? dayjs(record.endTime) : null
      ]
    });
    setCreateModalOpen(true);
  };

  const onGenerateCode = async (examId) => {
    try {
      const res = await InstructorFEApi.generateCode(examId);
      message.success('Code generated: ' + res.data.examCode);
      // Refresh student list
      const updatedRes = await InstructorFEApi.getByClass(classId);
      setStudentExams(updatedRes.data || []);
    } catch (err) {
      message.error('Failed to generate code');
    }
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
        startTime: values.timeRange?.[0]?.toISOString(),
        endTime: values.timeRange?.[1]?.toISOString(),
      };

      if (selectedConfig) {
         // Update Config
         await InstructorFEApi.updateClassPartialConfig(payload);
         message.success(t('instructor.finalExam.updateSuccess'));
      } else {
         // Create New
         await InstructorFEApi.createClassPartial(payload);
         message.success(t('instructor.finalExam.createSuccess'));
      }
      
      setCreateModalOpen(false);
      fetchConfig();
    } catch (err) {
      message.error(err.response?.data?.message || 'Operation failed');
    }
  };

  // Main Table Columns (Config)
  const columns = [
    {
      title: t('instructor.finalExam.examName'),
      key: 'name',
      render: (_, record) => (
        <a onClick={() => handleView(record)} className="font-medium text-blue-600 hover:underline">
          {record.quizName || 'Theory Exam'}
        </a>
      ),
    },
    {
      title: t('instructor.finalExam.duration'),
      dataIndex: 'duration',
      align: 'center',
      render: (val) => val ? `${val} min` : '-',
    },
    {
      title: 'Weight (%)',
      dataIndex: 'examWeight',
      align: 'center',
    },
    {
      title: 'Start Time',
      dataIndex: 'startTime',
      render: (val) => val ? dayjs(val).format('YYYY-MM-DD HH:mm') : '-',
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
      ),
    },
  ];

  // Student Detail Table Columns
  const studentColumns = [
    { title: 'Trainee', dataIndex: 'traineeName' },
    { title: 'Trainee Code', dataIndex: 'traineeCode' },
    { 
      title: 'Exam Code', 
      dataIndex: 'examCode',
      render: (code, record) => {
        const partial = record.partials?.find(p => p.type === 'Theory');
        // Only show code logic if TE exists for student
        if (!partial) return '-'; 
        
        return (
          <div className="flex items-center gap-2">
             <span className="font-mono font-bold text-blue-600">{record.examCode || '-'}</span>
             {!record.examCode && (
               <Button size="small" icon={<ReloadOutlined />} onClick={() => onGenerateCode(record.id)}>
                 Gen
               </Button>
             )}
          </div>
        );
      }
    },
    { 
      title: 'Score', 
      key: 'score',
      render: (_, record) => {
        const partial = record.partials?.find(p => p.type === 'Theory');
        return partial?.marks !== null && partial?.marks !== undefined ? partial.marks : '-';
      }
    },
    {
      title: 'Result',
      key: 'result',
      render: (_, r) => {
         const p = r.partials?.find(p => p.type === 'Theory');
         if (!p) return '-';
         
         // If status is NotYet, display Not Yet (Neutral)
         if (p.status === 'NotYet') return <Tag color="default">Not Yet</Tag>;

         if (p.isPass === true) return <Tag color="success">PASS</Tag>;
         if (p.isPass === false) return <Tag color="error">FAIL</Tag>;
         return '-';
      }
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
         const p = record.partials?.find(p => p.type === 'Theory');
         let statusText = p?.status || 'Pending';
         let color = 'default';

         if (p?.status === 'Approved') color = 'green';
         else if (p?.status === 'Submitted') color = 'orange';
         
         // Format 'NotYet' -> 'Not Yet'
         if (statusText === 'NotYet') statusText = 'Not Yet';

         return <Tag color={color}>{statusText}</Tag>;
      }
    }
  ];

  return (
    <div className="py-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-lg font-semibold text-slate-800">{t('instructor.finalExam.teTitle')}</span>
        </div>
        {configs.length === 0 && (
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            {t('instructor.finalExam.createExam')}
            </Button>
        )}
      </div>

      <Table
        columns={columns}
        dataSource={configs}
        rowKey={(r) => r.type}
        loading={loading}
        pagination={false}
      />

      {/* Create/Edit Modal */}
      <Modal
        title={selectedConfig ? "Update Configuration" : "Create Theory Exam"}
        open={createModalOpen}
        onOk={handleSave}
        onCancel={() => setCreateModalOpen(false)}
      >
        <Form form={form} layout="vertical">
           <Form.Item name="quizId" label="Select Quiz" rules={[{ required: true }]}>
             <Select 
                options={quizzes.map(q => ({ label: q.name, value: q.id }))} 
                placeholder="Choose a quiz"
             />
           </Form.Item>
           <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true }]}>
             <InputNumber min={1} className="w-full" />
           </Form.Item>
           <Form.Item name="examWeight" label="Weight (%)" rules={[{ required: true }]}>
             <InputNumber min={0} max={100} className="w-full" />
           </Form.Item>
           <Form.Item name="timeRange" label="Time Range">
             <DatePicker.RangePicker showTime className="w-full" />
           </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title="Student Exam Codes & Status"
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={800}
      >
        <Table 
            dataSource={studentExams} 
            columns={studentColumns} 
            rowKey="id"
            loading={loading}
        />
      </Modal>
    </div>
  );
}