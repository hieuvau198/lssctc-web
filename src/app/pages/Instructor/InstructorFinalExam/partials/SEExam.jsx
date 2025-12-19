import { Table, Modal, Form, InputNumber, App, DatePicker, Select } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit3, Monitor, Users, ExternalLink } from 'lucide-react';
import dayjs from 'dayjs';
import InstructorFEApi from '../../../../apis/Instructor/InstructorFEApi';
import InstructorPracticeApi from '../../../../apis/Instructor/InstructorPractice';
import { useNavigate } from 'react-router-dom';

export default function SEExam({ classId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const navigate = useNavigate();
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
        practiceId: values.practiceId,
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
      title: <span className="uppercase font-black text-xs">Exam Name</span>,
      key: 'name',
      render: (_, record) => (
        <button
          onClick={() => handleView(record)}
          className="font-bold text-black hover:text-yellow-600 uppercase flex items-center gap-2"
        >
          <Monitor className="w-4 h-4" />
          {record.practiceName || 'Simulation Exam'}
        </button>
      ),
    },
    {
      title: <span className="uppercase font-black text-xs">Duration</span>,
      dataIndex: 'duration',
      align: 'center',
      render: (val) => <span className="font-bold">{val} min</span>
    },
    {
      title: <span className="uppercase font-black text-xs">Weight</span>,
      dataIndex: 'examWeight',
      align: 'center',
      render: (val) => <span className="font-bold">{val}%</span>
    },
    {
      title: <span className="uppercase font-black text-xs">Start Time</span>,
      dataIndex: 'startTime',
      render: (val) => val ? <span className="text-neutral-600">{dayjs(val).format('YYYY-MM-DD HH:mm')}</span> : '-',
    },
    {
      title: <span className="uppercase font-black text-xs">Actions</span>,
      render: (_, record) => (
        <button
          onClick={() => {
            setSelectedConfig(record);
            form.setFieldsValue({
              ...record,
              practiceId: record.practiceId,
              timeRange: [record.startTime ? dayjs(record.startTime) : null, record.endTime ? dayjs(record.endTime) : null]
            });
            setCreateModalOpen(true);
          }}
          className="w-8 h-8 border-2 border-black bg-white hover:bg-yellow-400 flex items-center justify-center transition-all"
        >
          <Edit3 className="w-4 h-4 text-black" />
        </button>
      ),
    },
  ];

  const studentColumns = [
    {
      title: <span className="uppercase font-black text-xs">Trainee</span>,
      dataIndex: 'traineeName',
      render: (val) => <span className="font-bold">{val}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">Code</span>,
      dataIndex: 'traineeCode',
      render: (val) => <span className="text-neutral-600 font-medium">{val}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">Score</span>,
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Simulation');
        return p?.marks !== null ? (
          <span className="px-3 py-1 bg-yellow-400 text-black font-black text-sm">{p.marks}</span>
        ) : '-';
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Result</span>,
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Simulation');
        if (!p) return '-';

        if (p.status === 'NotYet') return <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase">Not Yet</span>;

        if (p.isPass === true) return <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase">PASS</span>;
        if (p.isPass === false) return <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold uppercase">FAIL</span>;
        return '-';
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Status</span>,
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Simulation');
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
    <div className="py-4">
      {/* Action Buttons */}
      <div className="mb-4 flex justify-between items-center">
        <button
          onClick={() => navigate(`/instructor/classes/${classId}/final-exam/se-results`)}
          className="h-10 px-4 flex items-center gap-2 bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-neutral-100 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Detailed Results
        </button>
        {configs.length === 0 && (
          <button
            onClick={() => { setSelectedConfig(null); form.resetFields(); setCreateModalOpen(true); }}
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
          rowKey="type"
          pagination={false}
          loading={loading}
          className="[&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-black [&_.ant-table-tbody>tr>td]:border-neutral-200"
        />
      </div>

      {/* Create/Edit Modal - Industrial Theme */}
      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Monitor className="w-4 h-4 text-black" />
            </div>
            <span className="font-black uppercase tracking-tight">
              Configure Simulation Exam
            </span>
          </div>
        }
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
            name="practiceId"
            label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">Select Practice</span>}
            rules={[{ required: true, message: 'Please select a practice' }]}
          >
            <Select
              options={practices.map(p => ({ label: p.practiceName, value: p.id }))}
              placeholder="Choose a practice"
              className="[&_.ant-select-selector]:!border-2 [&_.ant-select-selector]:!border-neutral-300 [&_.ant-select-selector]:!h-11 [&_.ant-select-selector]:hover:!border-black [&_.ant-select-focused_.ant-select-selector]:!border-black [&_.ant-select-focused_.ant-select-selector]:!shadow-none"
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
                className="!w-full [&_.ant-input-number-input]:!h-9 !border-2 !border-neutral-300 hover:!border-black focus-within:!border-black focus-within:!shadow-none"
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
                className="!w-full [&_.ant-input-number-input]:!h-9 !border-2 !border-neutral-300 hover:!border-black focus-within:!border-black focus-within:!shadow-none"
              />
            </Form.Item>
          </div>
          <Form.Item
            name="timeRange"
            label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">Time Range</span>}
          >
            <DatePicker.RangePicker
              showTime
              className="!w-full [&_.ant-picker-input>input]:!h-9 !border-2 !border-neutral-300 hover:!border-black focus-within:!border-black focus-within:!shadow-none"
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* View Details Modal */}
      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={800}
        title={
          <div className="flex items-center gap-2 font-black uppercase">
            <Users className="w-5 h-5" />
            Student Details
          </div>
        }
      >
        <div className="border-2 border-black">
          <div className="h-1 bg-yellow-400" />
          <Table
            dataSource={studentExams}
            columns={studentColumns}
            rowKey="id"
            className="[&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-black [&_.ant-table-tbody>tr>td]:border-neutral-200"
          />
        </div>
      </Modal>
    </div>
  );
}
