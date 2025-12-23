import { Table, Modal, Form, InputNumber, App, DatePicker, Input, Switch, Divider } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus, Edit3, MinusCircle, Check, X, ClipboardList, Users, Award } from 'lucide-react';
import dayjs from 'dayjs';
import InstructorFEApi from '../../../../apis/Instructor/InstructorFEApi';
import DayTimeFormat from '../../../../components/DayTimeFormat/DayTimeFormat';

export default function PEExam({ classId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState([]);
  const [isExamCompleted, setIsExamCompleted] = useState(false); // State for lock status
  const [isExamNotYet, setIsExamNotYet] = useState(true); // State for NotYet status - disable grading

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
      setIsExamCompleted(response.data?.status === 'Completed');
      setIsExamNotYet(response.data?.status === 'NotYet');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [classId]);

  useEffect(() => { if (classId) fetchConfig(); }, [classId, fetchConfig]);

  // --- Handlers for Config/Template ---

  const handleOpenConfig = (config) => {
    if (!isExamNotYet) return; // [UPDATED] Only allow if NotYet (Prevent create/edit if open/completed)

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

      message.success(t('instructor.finalExam.updateSuccess'));
      setCreateModalOpen(false);
      fetchConfig();
    } catch (err) {
      if (err.errorFields) {
        message.warning(t('instructor.finalExam.checkValidationErrors'));
        return;
      }
      console.error(err);
      message.error(err.response?.data?.message || t('instructor.finalExam.saveFailed'));
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
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.examName')}</span>,
      key: 'name',
      render: (_, record) => (
        <button
          onClick={() => handleViewStudents(record)}
          className="font-bold text-black hover:text-yellow-600 uppercase flex items-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          {t('instructor.finalExam.practicalExamWith')} {record.checklist?.length > 0 ? `(${record.checklist.length} ${t('instructor.finalExam.criteria')})` : ''}
        </button>
      ),
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.duration')}</span>,
      dataIndex: 'duration',
      align: 'center',
      render: (val) => <span className="font-bold">{val} {t('instructor.finalExam.minutes')}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.weight')}</span>,
      dataIndex: 'examWeight',
      align: 'center',
      render: (val) => <span className="font-bold">{val}%</span>
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.startTime')}</span>,
      dataIndex: 'startTime',
      render: (val) => val ? <span className="text-neutral-600"><DayTimeFormat value={val} showTime /></span> : '-',
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.action')}</span>,
      width: 100,
      render: (_, record) => (
        <button
          onClick={() => handleOpenConfig(record)}
          disabled={!isExamNotYet}
          className={`w-8 h-8 border-2 flex items-center justify-center transition-all ${!isExamNotYet
            ? 'bg-neutral-200 border-neutral-400 text-neutral-400 cursor-not-allowed'
            : 'border-black bg-white hover:bg-yellow-400 text-black'
            }`}
        >
          <Edit3 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  const studentColumns = [
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.trainee')}</span>,
      dataIndex: 'traineeName',
      width: '25%',
      render: (val) => <span className="font-bold">{val}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.traineeCode')}</span>,
      dataIndex: 'traineeCode',
      width: '15%',
      render: (val) => <span className="text-neutral-600 font-medium">{val}</span>
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.checklistExecution')}</span>,
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        if (!p?.checklists) return '-';
        const passedCount = p.checklists.filter(c => c.isPass).length;
        const totalCount = p.checklists.length;
        return <span className="font-bold">{passedCount} / {totalCount} <span className="text-neutral-500 font-medium">{t('instructor.finalExam.pass')}</span></span>;
      }
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.score')}</span>,
      width: '10%',
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        return p?.marks !== null ? (
          <span className="px-3 py-1 bg-yellow-400 text-black font-black text-sm">{p.marks}</span>
        ) : '-';
      }
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.result')}</span>,
      width: 100,
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        if (!p) return '-';

        if (p.status === 'NotYet') return <span className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs font-bold uppercase whitespace-nowrap">{t('instructor.finalExam.notYet')}</span>;

        if (p.isPass === true) return <span className="px-2 py-1 bg-yellow-400 text-black text-xs font-bold uppercase whitespace-nowrap">{t('instructor.finalExam.pass')}</span>;
        if (p.isPass === false) return <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold uppercase whitespace-nowrap">{t('instructor.finalExam.fail')}</span>;
        return '-';
      }
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.status')}</span>,
      width: '15%',
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        let statusText = p?.status || 'Pending';
        let bgColor = 'bg-neutral-100 text-neutral-600';

        if (p?.status === 'Approved') bgColor = 'bg-yellow-400 text-black';
        else if (p?.status === 'Submitted') bgColor = 'bg-neutral-800 text-yellow-400';

        if (statusText === 'NotYet') statusText = t('instructor.finalExam.notYet');

        return <span className={`px-2 py-1 text-xs font-bold uppercase ${bgColor}`}>{statusText}</span>;
      }
    },
    {
      title: <span className="uppercase font-black text-xs">{t('instructor.finalExam.action')}</span>,
      key: 'action',
      width: '10%',
      render: (_, record) => {
        const isGradeDisabled = isExamCompleted || isExamNotYet;
        return (
          <button
            onClick={() => handleOpenGrading(record)}
            disabled={isGradeDisabled}
            className={`px-4 py-2 font-bold uppercase text-xs border-2 transition-all ${isGradeDisabled
              ? 'bg-neutral-200 border-neutral-400 text-neutral-400 cursor-not-allowed'
              : 'bg-yellow-400 text-black border-black hover:bg-yellow-500'
              }`}
          >
            {t('instructor.finalExam.grading')}
          </button>
        );
      }
    }
  ];

  return (
    <div className="py-4">
      {/* Action Button - Only show when no configs exist */}
      {configs.length === 0 && isExamNotYet && ( // [UPDATED] Only allowed if NotYet
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => handleOpenConfig(null)}
            className="h-10 px-4 flex items-center gap-2 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-all"
          >
            <Plus className="w-4 h-4" />
            {t('instructor.finalExam.createExam', 'Tạo bài thi')}
          </button>
        </div>
      )}

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

      {/* Create/Edit Configuration Modal - Industrial Theme */}
      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-black" />
            </div>
            <span className="font-black uppercase tracking-tight">
              {t('instructor.finalExam.configModalTitlePE')}
            </span>
          </div>
        }
        width={700}
        footer={
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-neutral-200">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="px-6 py-2.5 bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-neutral-100 transition-colors"
            >
              {t('instructor.finalExam.cancel')}
            </button>
            <button
              onClick={handleSaveConfig}
              className="px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-colors"
            >
              {t('instructor.finalExam.saveConfig')}
            </button>
          </div>
        }
        className="[&_.ant-modal-header]:border-b-4 [&_.ant-modal-header]:border-yellow-400 [&_.ant-modal-header]:pb-4"
      >
        <Form form={form} layout="vertical" className="pt-4">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="duration"
              label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">{t('instructor.finalExam.durationMinutes')}</span>}
              rules={[{ required: true, message: t('instructor.finalExam.required') }]}
            >
              <InputNumber
                min={1}
                className="!w-full [&_.ant-input-number-input]:!h-9 !border-2 !border-neutral-300 hover:!border-black focus-within:!border-yellow-400 focus-within:!shadow-none"
              />
            </Form.Item>
            <Form.Item
              name="examWeight"
              label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">{t('instructor.finalExam.weightPercent')}</span>}
              rules={[{ required: true, message: t('instructor.finalExam.required') }]}
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
            label={<span className="font-bold uppercase text-xs tracking-wider text-neutral-600">{t('instructor.finalExam.timeRange')}</span>}
            dependencies={['duration']}
            rules={[
              { required: true, message: t('instructor.finalExam.timeRangeRequired') },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || value.length < 2) {
                    return Promise.resolve();
                  }
                  const [start, end] = value;
                  const duration = getFieldValue('duration');

                  if (duration === undefined || duration === null) {
                    return Promise.resolve();
                  }

                  const diff = end.diff(start, 'minute');
                  if (diff !== duration) {
                    return Promise.reject(new Error(t('instructor.finalExam.timeRangeMustMatchDuration', { duration })));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <DatePicker.RangePicker
              showTime
              format="DD-MM-YYYY HH:mm:ss"
              disabledDate={(current) => current && current < dayjs().startOf('day')}
              className="!w-full [&_.ant-picker-input>input]:!h-9 !border-2 !border-neutral-300 hover:!border-black focus-within:!border-yellow-400 focus-within:!shadow-none"
            />
          </Form.Item>

          {/* Checklist Section with Industrial Divider */}
          <div className="mt-6 mb-4">
            <div className="flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-neutral-200"></div>
              <span className="font-bold uppercase text-xs tracking-wider text-neutral-600 px-2 bg-white">{t('instructor.finalExam.checklistTemplate')}</span>
              <div className="h-0.5 flex-1 bg-neutral-200"></div>
            </div>
          </div>

          <Form.List name="checklistConfig">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-3 items-start mb-3">
                    <Form.Item
                      {...restField}
                      name={[name, 'name']}
                      rules={[{ required: true, message: t('instructor.finalExam.required') }]}
                      className="flex-1 mb-0"
                    >
                      <Input
                        placeholder={t('instructor.finalExam.criteriaNamePlaceholder')}
                        className="!h-10 !border-2 !border-neutral-300 hover:!border-black focus:!border-yellow-400 focus:!shadow-none"
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'description']}
                      className="flex-1 mb-0"
                    >
                      <Input
                        placeholder={t('instructor.finalExam.criteriaDescription')}
                        className="!h-10 !border-2 !border-neutral-300 hover:!border-black focus:!border-yellow-400 focus:!shadow-none"
                      />
                    </Form.Item>
                    <button
                      type="button"
                      onClick={() => remove(name)}
                      className="w-10 h-10 bg-white text-red-600 border-2 border-red-300 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center transition-all"
                    >
                      <MinusCircle className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <Form.Item className="mb-0">
                  <button
                    type="button"
                    onClick={() => add()}
                    className="w-full py-2.5 border-2 border-dashed border-neutral-400 text-neutral-600 font-bold uppercase text-sm hover:border-yellow-400 hover:text-black hover:bg-yellow-50 flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    {t('instructor.finalExam.addCriteria')}
                  </button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>

      {/* View Students List Modal - Industrial Theme */}
      <Modal
        open={viewModalOpen}
        onCancel={() => setViewModalOpen(false)}
        footer={null}
        width={1000}
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Users className="w-4 h-4 text-black" />
            </div>
            <span className="font-black uppercase tracking-tight">
              {t('instructor.finalExam.studentDetails')}
            </span>
          </div>
        }
        className="[&_.ant-modal-header]:border-b-4 [&_.ant-modal-header]:border-yellow-400 [&_.ant-modal-header]:pb-4"
      >
        <div className="border-2 border-black mt-4">
          <div className="h-1 bg-yellow-400" />
          <Table
            dataSource={studentExams}
            columns={studentColumns}
            rowKey="id"
            className="[&_.ant-table-thead>tr>th]:bg-neutral-900 [&_.ant-table-thead>tr>th]:text-white [&_.ant-table-thead>tr>th]:border-black [&_.ant-table-tbody>tr>td]:border-neutral-200"
          />
        </div>
      </Modal>

      {/* Grading Modal - Industrial Theme */}
      <Modal
        open={gradingModalOpen}
        onCancel={() => setGradingModalOpen(false)}
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-yellow-400 border-2 border-black flex items-center justify-center">
              <Award className="w-4 h-4 text-black" />
            </div>
            <span className="font-black uppercase tracking-tight">
              {t('instructor.finalExam.gradingFor')} <span className="text-yellow-600">{currentTraineeName}</span>
            </span>
          </div>
        }
        width={600}
        footer={
          <div className="flex justify-end gap-3 pt-4 border-t-2 border-neutral-200">
            <button
              onClick={() => setGradingModalOpen(false)}
              className="px-6 py-2.5 bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-neutral-100 transition-colors"
            >
              {t('instructor.finalExam.cancel')}
            </button>
            <button
              onClick={handleSubmitGrade}
              className="px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-colors"
            >
              {t('instructor.finalExam.submitGrade')}
            </button>
          </div>
        }
        className="[&_.ant-modal-header]:border-b-4 [&_.ant-modal-header]:border-yellow-400 [&_.ant-modal-header]:pb-4"
      >
        <Form form={gradingForm} layout="vertical" className="pt-4">
          {/* Checklist Section with Industrial Divider */}
          <div className="mb-4">
            <div className="flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-neutral-200"></div>
              <span className="font-bold uppercase text-xs tracking-wider text-neutral-600 px-2 bg-white">{t('instructor.finalExam.checklistExecution')}</span>
              <div className="h-0.5 flex-1 bg-neutral-200"></div>
            </div>
          </div>
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

          {/* Overall Result Section */}
          <div className="my-4">
            <div className="flex items-center gap-2">
              <div className="h-0.5 flex-1 bg-neutral-200"></div>
            </div>
          </div>

          <Form.Item
            name="isOverallPass"
            valuePropName="checked"
            label={<span className="font-black text-lg uppercase">{t('instructor.finalExam.overallResult')}</span>}
            className="bg-yellow-50 p-4 border-2 border-yellow-400"
          >
            <Switch
              checkedChildren={t('instructor.finalExam.pass')}
              unCheckedChildren={t('instructor.finalExam.fail')}
              className="bg-neutral-400"
              style={{ width: 110 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}