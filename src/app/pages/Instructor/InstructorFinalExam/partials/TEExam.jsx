import { Table, Modal, Form, InputNumber, App, DatePicker, Select } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit3, RefreshCw, FileText, Users } from 'lucide-react';
import dayjs from 'dayjs';
import InstructorFEApi from '../../../../apis/Instructor/InstructorFEApi';
import InstructorQuizApi from '../../../../apis/Instructor/InstructorQuiz';
import DayTimeFormat from '../../../../components/DayTimeFormat/DayTimeFormat';

export default function TEExam({ classId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [isExamNotYet, setIsExamNotYet] = useState(true); // State for NotYet status

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
      setIsExamCompleted(response.data?.status === 'Completed');
      setIsExamNotYet(response.data?.status === 'NotYet');
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
    if (isExamCompleted) return; // [UPDATED] Guard
    setSelectedConfig(null);
    form.resetFields();
    setCreateModalOpen(true);
  };

  const handleEdit = (record) => {
    if (isExamCompleted) return; // [UPDATED] Guard
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
      render: (val) => val ? <span className="text-neutral-600"><DayTimeFormat value={val} showTime /></span> : '-',
    },
    {
      title: <span className="uppercase font-black text-xs">Actions</span>,
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <button
          onClick={() => handleEdit(record)}
          disabled={isExamCompleted} // [UPDATED]
          className={`w-8 h-8 border-2 flex items-center justify-center transition-all ${isExamCompleted
            ? 'bg-neutral-200 border-neutral-400 text-neutral-400 cursor-not-allowed'
            : 'border-black bg-white hover:bg-yellow-400 text-black'
            }`}
        >
          <Edit3 className="w-4 h-4" />
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
      key: 'examCode',
      render: (_, record) => {
        // Try to get examCode from partials first, then from record directly
        const partial = record.partials?.find(p => p.type === 'Theory');
        const code = partial?.examCode || record.examCode;
        return code ? (
          <span className="font-mono font-black text-yellow-600">{code}</span>
        ) : (
          <span className="text-neutral-400">-</span>
        );
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Score</span>,
      key: 'score',
      render: (_, record) => {
        const partial = record.partials?.find(p => p.type === 'Theory');
        const marks = partial?.marks ?? record.marks;
        return marks !== null && marks !== undefined ? (
          <span className="px-3 py-1 bg-yellow-400 text-black font-black text-sm">{marks}</span>
        ) : <span className="text-neutral-400">-</span>;
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Result</span>,
      key: 'result',
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Theory');
        const status = p?.status || r.status;
        const isPass = p?.isPass ?? r.isPass;

        if (status === 'NotYet') return <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase">Not Yet</span>;

        if (isPass === true) return <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase">PASS</span>;
        if (isPass === false) return <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold uppercase">FAIL</span>;
        return <span className="text-neutral-400">-</span>;
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Status</span>,
      key: 'status',
      render: (_, record) => {
        const p = record.partials?.find(p => p.type === 'Theory');
        let statusText = p?.status || record.status || 'Pending';
        let bgColor = 'bg-neutral-100 text-neutral-600';

        if (statusText === 'Approved') bgColor = 'bg-yellow-400 text-black';
        else if (statusText === 'Submitted') bgColor = 'bg-neutral-800 text-yellow-400';

        if (statusText === 'NotYet') statusText = 'NOT YET';

        return <span className={`px-2 py-1 text-xs font-bold uppercase ${bgColor}`}>{statusText}</span>;
      }
    }
  ];

  return (
    <div className="py-4">
      {/* Action Button - Only show when no configs exist */}
      {configs.length === 0 && !isExamCompleted && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={handleCreate}
            className="h-10 px-4 flex items-center gap-2 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('instructor.finalExam.createExam')}
          </button>
        </div>
      )}

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

      {/* Create/Edit Modal - Industrial Theme */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <FileText className="w-4 h-4 text-black" />
            </div>
            <span className="font-black uppercase tracking-tight">
              {selectedConfig ? "Update Configuration" : "Create Theory Exam"}
            </span>
          </div>
        }
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-neutral-200">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="px-6 py-2.5 bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-neutral-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-colors"
            >
              Save
            </button>
          </div>
        }
        className="[&_.ant-modal-header]:border-b-4 [&_.ant-modal-header]:border-yellow-400 [&_.ant-modal-header]:pb-4"
      >
        <Form form={form} layout="vertical" className="pt-4">
          <Form.Item
            name="quizId"
            label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">Select Quiz</span>}
            rules={[{ required: true, message: 'Please select a quiz' }]}
          >
            <Select
              options={quizzes.map(q => ({ label: q.name, value: q.id }))}
              placeholder="Choose a quiz"
              className="[&_.ant-select-selector]:!border-2 [&_.ant-select-selector]:!border-neutral-300 [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:hover:!border-black [&_.ant-select-focused_.ant-select-selector]:!border-yellow-400 [&_.ant-select-focused_.ant-select-selector]:!shadow-none"
            />
          </Form.Item>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="duration"
              label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">Duration (minutes)</span>}
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber
                min={1}
                className="!w-full [&_.ant-input-number-input]:!h-9 !border-2 !border-neutral-300 hover:!border-black focus-within:!border-yellow-400 focus-within:!shadow-none"
              />
            </Form.Item>
            <Form.Item
              name="examWeight"
              label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">Weight (%)</span>}
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber
                min={0}
                max={100}
                disabled
                className="!w-full [&_.ant-input-number-input]:!h-9 !border-2 !border-neutral-300 hover:!border-black focus-within:!border-yellow-400 focus-within:!shadow-none"
              />
            </Form.Item>
          </div>
          <Form.Item
            name="timeRange"
            label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">Time Range</span>}
          >
            <DatePicker.RangePicker
              showTime
              format="DD-MM-YYYY HH:mm:ss"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              className="!w-full [&_.ant-picker-input>input]:!h-9 !border-2 !border-neutral-300 hover:!border-black focus-within:!border-yellow-400 focus-within:!shadow-none"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal - Industrial Theme */}
      <Modal
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Users className="w-4 h-4 text-black" />
            </div>
            <span className="font-black uppercase tracking-tight">
              Student Exam Codes & Status
            </span>
          </div>
        }
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={900}
        className="[&_.ant-modal-header]:border-b-4 [&_.ant-modal-header]:border-yellow-400 [&_.ant-modal-header]:pb-4"
      >
        <div className="border-2 border-black mt-4">
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