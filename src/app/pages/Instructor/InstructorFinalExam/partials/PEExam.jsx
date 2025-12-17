import { Table, Modal, Form, InputNumber, App, DatePicker, Input, Switch, Divider } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit3, MinusCircle, Check, X, ClipboardList, Users, Award } from 'lucide-react';
import dayjs from 'dayjs';
import InstructorFEApi from '../../../../apis/Instructor/InstructorFEApi';

export default function PEExam({ classId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);

  // States for Config Modal (Template)
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState(null);

  // States for Student List & Grading
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [studentExams, setStudentExams] = useState([]);

  // States for Grading Modal
  const [gradingModalOpen, setGradingModalOpen] = useState(false);
  const [currentGradingPartial, setCurrentGradingPartial] = useState(null);
  const [currentTraineeName, setCurrentTraineeName] = useState('');

  const [form] = Form.useForm();
  const [gradingForm] = Form.useForm();

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    try {
      const response = await InstructorFEApi.getClassConfig(classId);
      setConfigs(response.data?.partialConfigs?.filter(c => c.type === 'Practical') || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { if (classId) fetchConfig(); }, [classId, fetchConfig]);

  // --- Handlers for Config/Template ---

  const handleOpenConfig = (config) => {
    setSelectedConfig(config);
    if (config) {
      form.setFieldsValue({
        ...config,
        timeRange: [config.startTime ? dayjs(config.startTime) : null, config.endTime ? dayjs(config.endTime) : null],
        checklistConfig: config.checklist || []
      });
    } else {
      form.resetFields();
    }
    setCreateModalOpen(true);
  };

  const handleSaveConfig = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        classId: parseInt(classId),
        type: 'Practical',
        examWeight: values.examWeight,
        duration: values.duration,
        startTime: values.timeRange?.[0]?.toISOString(),
        endTime: values.timeRange?.[1]?.toISOString(),
        checklistConfig: values.checklistConfig
      };

      if (selectedConfig) await InstructorFEApi.updateClassPartialConfig(payload);
      else await InstructorFEApi.createClassPartial(payload);

      message.success('Configuration saved successfully');
      setCreateModalOpen(false);
      fetchConfig();
    } catch (err) {
      console.error(err);
      message.error('Failed to save configuration');
    }
  };

  // --- Handlers for Student List View ---

  const handleViewStudents = async (config) => {
    setSelectedConfig(config);
    setLoading(true);
    try {
      const res = await InstructorFEApi.getByClass(classId);
      setStudentExams(res.data || []);
      setViewModalOpen(true);
    } catch (error) {
      message.error("Failed to load student list");
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers for Grading ---

  const handleOpenGrading = (traineeExam) => {
    const partial = traineeExam.partials?.find(p => p.type === 'Practical');
    if (!partial) {
      message.error("No Practical exam data found for this student");
      return;
    }

    setCurrentGradingPartial(partial);
    setCurrentTraineeName(traineeExam.traineeName);

    gradingForm.setFieldsValue({
      checklist: partial.checklists?.map(item => ({
        ...item,
        isPass: item.isPass === true
      })),
      isOverallPass: partial.marks >= 5
    });

    if (partial.marks === null || partial.marks === undefined) {
      gradingForm.setFieldValue('isOverallPass', false);
    }

    setGradingModalOpen(true);
  };

  const handleSubmitGrade = async () => {
    try {
      const values = await gradingForm.validateFields();

      const payload = {
        checklist: values.checklist.map(item => ({
          id: item.id,
          name: item.name,
          description: item.description,
          isPass: item.isPass
        })),
        isOverallPass: values.isOverallPass
      };

      await InstructorFEApi.submitPe(currentGradingPartial.id, payload);

      message.success("Grading submitted successfully");
      setGradingModalOpen(false);

      handleViewStudents(selectedConfig);
    } catch (error) {
      console.error(error);
      message.error("Failed to submit grade");
    }
  };

  // --- Table Columns ---

  const configColumns = [
    {
      title: <span className="uppercase font-black text-xs">Exam Name</span>,
      key: 'name',
      render: (_, record) => (
        <button
          onClick={() => handleViewStudents(record)}
          className="font-bold text-black hover:text-yellow-600 uppercase flex items-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          Practical Exam {record.checklist?.length > 0 ? `(${record.checklist.length} criteria)` : ''}
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
      width: 100,
      render: (_, record) => (
        <button
          onClick={() => handleOpenConfig(record)}
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
      width: '25%',
      render: (val) => <span className="font-bold">{val}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">Code</span>,
      dataIndex: 'traineeCode',
      width: '15%',
      render: (val) => <span className="text-neutral-600 font-medium">{val}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">Performance</span>,
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        if (!p?.checklists) return '-';
        const passedCount = p.checklists.filter(c => c.isPass).length;
        const totalCount = p.checklists.length;
        return <span className="font-bold">{passedCount} / {totalCount} <span className="text-neutral-500 font-medium">passed</span></span>;
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Score</span>,
      width: '10%',
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        return p?.marks !== null ? (
          <span className="px-3 py-1 bg-yellow-400 text-black font-black text-sm">{p.marks}</span>
        ) : '-';
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Result</span>,
      width: '10%',
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        if (!p) return '-';

        if (p.status === 'NotYet') return <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase">Not Yet</span>;

        if (p.isPass === true) return <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase">PASS</span>;
        if (p.isPass === false) return <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold uppercase">FAIL</span>;
        return '-';
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Status</span>,
      width: '15%',
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        let statusText = p?.status || 'Pending';
        let bgColor = 'bg-neutral-100 text-neutral-600';

        if (p?.status === 'Approved') bgColor = 'bg-yellow-400 text-black';
        else if (p?.status === 'Submitted') bgColor = 'bg-neutral-800 text-yellow-400';

        if (statusText === 'NotYet') statusText = 'NOT YET';

        return <span className={`px-2 py-1 text-xs font-bold uppercase ${bgColor}`}>{statusText}</span>;
      }
    },
    {
      title: <span className="uppercase font-black text-xs">Action</span>,
      key: 'action',
      width: '10%',
      render: (_, record) => (
        <button
          onClick={() => handleOpenGrading(record)}
          className="px-4 py-2 bg-black text-yellow-400 font-bold uppercase text-xs border-2 border-black hover:bg-yellow-400 hover:text-black transition-all"
        >
          Grade
        </button>
      )
    }
  ];

  return (
    <div className="py-6">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
            <Award className="w-5 h-5 text-black" />
          </div>
          <h2 className="text-xl font-black uppercase tracking-tight m-0">{t('instructor.finalExam.peTitle')}</h2>
        </div>
        {configs.length === 0 && (
          <button
            onClick={() => handleOpenConfig(null)}
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
          columns={configColumns}
          dataSource={configs}
          rowKey="type"
          pagination={false}
          loading={loading}
          className="[&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-black [&_.ant-table-tbody>tr>td]:border-neutral-200"
        />
      </div>

      {/* --- Create/Edit Configuration Modal --- */}
      <Modal
        open={createModalOpen}
        onOk={handleSaveConfig}
        onCancel={() => setCreateModalOpen(false)}
        title={
          <div className="flex items-center gap-2 font-black uppercase">
            <ClipboardList className="w-5 h-5" />
            Configure Practical Exam
          </div>
        }
        width={700}
        okText="Save Configuration"
        okButtonProps={{ className: 'bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:bg-yellow-500' }}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration" label={<span className="font-bold uppercase text-xs">Duration (minutes)</span>} rules={[{ required: true }]}>
              <InputNumber min={1} className="w-full" />
            </Form.Item>
            <Form.Item name="examWeight" label={<span className="font-bold uppercase text-xs">Weight (%)</span>} rules={[{ required: true }]}>
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>
          </div>
          <Form.Item name="timeRange" label={<span className="font-bold uppercase text-xs">Valid Time Range</span>}>
            <DatePicker.RangePicker showTime className="w-full" />
          </Form.Item>

          <Divider orientation="left" className="font-bold uppercase text-sm">Checklist Template</Divider>

          <Form.List name="checklistConfig">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-2 items-start mb-2">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: 'Required' }]}
                      className="flex-1 mb-0"
                    >
                      <Input placeholder="Criteria Name (e.g. Safety Check)" className="border-2 border-neutral-300 focus:border-yellow-400" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      className="flex-1 mb-0"
                    >
                      <Input placeholder="Description (Optional)" className="border-2 border-neutral-300 focus:border-yellow-400" />
                    </Form.Item>
                    <button
                      type="button"
                      onClick={() => remove(name)}
                      className="mt-1 w-8 h-8 bg-red-100 text-red-600 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Form.Item>
                  <button
                    type="button"
                    onClick={() => add()}
                    className="w-full py-2 border-2 border-dashed border-neutral-400 text-neutral-600 font-bold uppercase text-sm hover:border-yellow-400 hover:text-yellow-600 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    Add Criteria
                  </button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* --- View Students List Modal --- */}
      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={1000}
        title={
          <div className="flex items-center gap-2 font-black uppercase">
            <Users className="w-5 h-5" />
            Student Practical Exams
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

      {/* --- Grading Modal --- */}
      <Modal
        open={gradingModalOpen}
        onOk={handleSubmitGrade}
        onCancel={() => setGradingModalOpen(false)}
        title={
          <div className="font-black uppercase">
            Grading: <span className="text-yellow-600">{currentTraineeName}</span>
          </div>
        }
        width={600}
        okText="Submit Grade"
        okButtonProps={{ className: 'bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:bg-yellow-500' }}
      >
        <Form form={gradingForm} layout="vertical">
          <Divider orientation="left" className="mt-0 font-bold uppercase text-sm">Performance Checklist</Divider>
          <div className="max-h-[400px] overflow-y-auto pr-2">
            <Form.List name="checklist">
              {(fields) => (
                <div className="space-y-2">
                  {fields.map((field, index) => {
                    const currentItem = gradingForm.getFieldValue(['checklist', index]);
                    return (
                      <div key={field.key} className="border-2 border-neutral-200 bg-neutral-50 p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex-1">
                            <div className="font-bold text-black">{currentItem?.name}</div>
                            {currentItem?.description && <div className="text-xs text-neutral-500 mt-1">{currentItem.description}</div>}
                            <Form.Item name={[field.name, 'id']} hidden><Input /></Form.Item>
                            <Form.Item name={[field.name, 'name']} hidden><Input /></Form.Item>
                            <Form.Item name={[field.name, 'description']} hidden><Input /></Form.Item>
                          </div>
                          <Form.Item name={[field.name, 'isPass']} valuePropName="checked" className="mb-0">
                            <Switch
                              checkedChildren={<Check className="w-3 h-3" />}
                              unCheckedChildren={<X className="w-3 h-3" />}
                              className="bg-neutral-300"
                            />
                          </Form.Item>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Form.List>
          </div>

          <Divider />

          <Form.Item
            name="isOverallPass"
            valuePropName="checked"
            label={<span className="font-black text-lg uppercase">Overall Result</span>}
            className="bg-yellow-50 p-4 border-2 border-yellow-400"
          >
            <Switch
              checkedChildren="PASS"
              unCheckedChildren="FAIL"
              className="bg-neutral-400"
              style={{ width: 100 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
