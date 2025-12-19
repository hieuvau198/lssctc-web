import { Table, Modal, Form, InputNumber, App, DatePicker, Select } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit3, RefreshCw, FileText, Users } from 'lucide-react';
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
      title: <span className="uppercase font-black text-xs">Exam Name</span>,
      key: 'name',
      render: (_, record) => (
        <button
          onClick={() => handleView(record)}
          className="font-bold text-black hover:text-yellow-600 uppercase flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          {record.quizName || 'Theory Exam'}
        </button>
      ),
    },
    {
      title: <span className="uppercase font-black text-xs">Duration</span>,
      dataIndex: 'duration',
      align: 'center',
      render: (val) => <span className="font-bold">{val ? `${val} min` : '-'}</span>,
    },
    {
      title: <span className="uppercase font-black text-xs">Weight</span>,
      dataIndex: 'examWeight',
      align: 'center',
      render: (val) => <span className="font-bold">{val}%</span>,
    },
    {
      title: <span className="uppercase font-black text-xs">Start Time</span>,
      dataIndex: 'startTime',
      render: (val) => val ? <span className="text-neutral-600">{dayjs(val).format('YYYY-MM-DD HH:mm')}</span> : '-',
    },
    {
      title: <span className="uppercase font-black text-xs">Actions</span>,
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <button
          onClick={() => handleEdit(record)}
          className="w-8 h-8 border-2 border-black bg-white hover:bg-yellow-400 flex items-center justify-center transition-all"
        >
          <Edit3 className="w-4 h-4 text-black" />
        </button>
      ),
    },
  ];

  // Student Detail Table Columns
  const studentColumns = [
    {
      title: <span className="uppercase font-black text-xs">Trainee</span>,
      dataIndex: 'traineeName',
      render: (val) => <span className="font-bold">{val}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">Trainee Code</span>,
      dataIndex: 'traineeCode',
      render: (val) => <span className="text-neutral-600 font-medium">{val}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">Exam Code</span>,
      dataIndex: 'examCode',
      render: (code, record) => {
        const partial = record.partials?.find(p => p.type === 'Theory');
        if (!partial) return '-';

        return (
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-yellow-600">{record.examCode || '-'}</span>
            {!record.examCode && (
              <button
                onClick={() => onGenerateCode(record.id)}
                className="px-2 py-1 bg-black text-yellow-400 font-bold uppercase text-xs border-2 border-black hover:bg-yellow-400 hover:text-black flex items-center gap-1 transition-all"
              >
                <RefreshCw className="w-3 h-3" />
                Gen
              </button>
            )}
          </div>
        );
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Score</span>,
      key: 'score',
      render: (_, record) => {
        const partial = record.partials?.find(p => p.type === 'Theory');
        return partial?.marks !== null && partial?.marks !== undefined ? (
          <span className="px-3 py-1 bg-yellow-400 text-black font-black text-sm">{partial.marks}</span>
        ) : '-';
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Result</span>,
      key: 'result',
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Theory');
        if (!p) return '-';

        if (p.status === 'NotYet') return <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase">Not Yet</span>;

        if (p.isPass === true) return <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase">PASS</span>;
        if (p.isPass === false) return <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold uppercase">FAIL</span>;
        return '-';
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Status</span>,
      key: 'status',
      render: (_, record) => {
        const p = record.partials?.find(p => p.type === 'Theory');
        let statusText = p?.status || 'Pending';
        let bgColor = 'bg-neutral-100 text-neutral-600';

        if (p?.status === 'Approved') bgColor = 'bg-yellow-400 text-black';
        else if (p?.status === 'Submitted') bgColor = 'bg-neutral-800 text-yellow-400';

        if (statusText === 'NotYet') statusText = 'NOT YET';

        return <span className={`px-2 py-1 text-xs font-bold uppercase ${bgColor}`}>{statusText}</span>;
      }
    }
  ];

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
            <FileText className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight m-0">{t('instructor.finalExam.teTitle')}</h2>
        </div>
        {configs.length === 0 && (
          <button
            onClick={handleCreate}
            className="h-10 px-4 flex items-center gap-2 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('instructor.finalExam.createExam')}
          </button>
        )}
      </div>

      {/* Config Table */}
      <div className="bg-white border-2 border-black">
        <div className="h-1 bg-yellow-400" />
        <Table
          columns={columns}
          dataSource={configs}
          rowKey={(r) => r.type}
          loading={loading}
          pagination={false}
          className="[&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-black [&_.ant-table-tbody>tr>td]:border-neutral-200"
        />
      </div>

      {/* Create/Edit Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 font-black uppercase">
            <FileText className="w-5 h-5" />
            {selectedConfig ? "Update Configuration" : "Create Theory Exam"}
          </div>
        }
        open={createModalOpen}
        onOk={handleSave}
        onCancel={() => setCreateModalOpen(false)}
        okText="Save"
        okButtonProps={{ className: 'bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:bg-yellow-500' }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="quizId" label={<span className="font-bold uppercase text-xs">Select Quiz</span>} rules={[{ required: true }]}>
            <Select
              options={quizzes.map(q => ({ label: q.name, value: q.id }))}
              placeholder="Choose a quiz"
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration" label={<span className="font-bold uppercase text-xs">Duration (minutes)</span>} rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name="examWeight" label={<span className="font-bold uppercase text-xs">Weight (%)</span>} rules={[{ required: true }]}>
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item name="timeRange" label={<span className="font-bold uppercase text-xs">Time Range</span>}>
            <DatePicker.RangePicker showTime className="w-full" />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 font-black uppercase">
            <Users className="w-5 h-5" />
            Student Exam Codes & Status
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={900}
      >
        <div className="border-2 border-black">
          <div className="h-1 bg-yellow-400" />
          <Table
            dataSource={studentExams}
            columns={studentColumns}
            rowKey="id"
            loading={loading}
            className="[&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-black [&_.ant-table-tbody>tr>td]:border-neutral-200"
          />
        </div>
      </Modal>
    </div>
  );
}
