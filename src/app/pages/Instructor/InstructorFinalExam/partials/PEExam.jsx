import { Table, Button, Tag, Space, Modal, Form, InputNumber, App, DatePicker, Card, Input, Switch, Checkbox, Typography, Divider } from 'antd';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, EditOutlined, MinusCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import InstructorFEApi from '../../../../apis/Instructor/InstructorFEApi';

const { Text } = Typography;

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
            checklistConfig: config.checklist || [] // Load existing checklist template
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
        checklistConfig: values.checklistConfig // Send the list of criteria
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
    setSelectedConfig(config); // Keep track of which config we are viewing (though mostly 1 PE per class)
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
    
    // Populate form with existing submission data or default structure
    gradingForm.setFieldsValue({
        checklist: partial.checklists?.map(item => ({
            ...item,
            isPass: item.isPass === true // Ensure boolean for Switch/Checkbox
        })),
        isOverallPass: partial.marks >= 5 // Determine logic for initial overall pass status based on marks or existing status
    });
    
    // If marks are not set/graded yet, we might want to default IsOverallPass to false or null
    if (partial.marks === null || partial.marks === undefined) {
        gradingForm.setFieldValue('isOverallPass', false);
    } else {
         // If partial is graded (marks exist), set the switch based on logic (e.g. marks > 0 or specific status)
         // Assuming simple logic: Marks > 0 means Pass? Or backend calculates? 
         // The Controller uses IsOverallPass from DTO to determine Pass/Fail.
         // Let's assume marks >= 50 or isPass flag if available.
         // DTO doesn't explicitly have isOverallPass property on the partial itself, usually inferred.
         // We will rely on the user input.
    }

    setGradingModalOpen(true);
  };

  const handleSubmitGrade = async () => {
    try {
        const values = await gradingForm.validateFields();
        
        // Prepare payload for SubmitPeDto
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
        
        // Refresh student list to show updated status
        handleViewStudents(selectedConfig); 
    } catch (error) {
        console.error(error);
        message.error("Failed to submit grade");
    }
  };

  // --- Table Columns ---

  const configColumns = [
    {
      title: t('instructor.finalExam.examName'),
      key: 'name',
      render: (_, record) => (
        <a onClick={() => handleViewStudents(record)} className="font-medium text-blue-600 hover:underline">
           Practical Exam {record.checklist?.length > 0 ? `(${record.checklist.length} criteria)` : ''}
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
      width: 100,
      render: (_, record) => (
        <Button type="link" icon={<EditOutlined />} onClick={() => handleOpenConfig(record)} />
      ),
    },
  ];

  const studentColumns = [
    { title: 'Trainee', dataIndex: 'traineeName', width: '25%' },
    { title: 'Code', dataIndex: 'traineeCode', width: '15%' },
    { 
      title: 'Performance', 
      render: (_, r) => {
        const p = r.partials?.find(p => p.type === 'Practical');
        if (!p?.checklists) return '-';
        const passedCount = p.checklists.filter(c => c.isPass).length;
        const totalCount = p.checklists.length;
        return <span>{passedCount} / {totalCount} passed</span>;
      }
    },
    { 
        title: 'Score', 
        width: '10%',
        render: (_, r) => {
          const p = r.partials?.find(p => p.type === 'Practical');
          return p?.marks !== null ? <Tag color="blue">{p.marks}</Tag> : '-';
        }
    },
    {
      title: 'Result',
      width: '10%',
      render: (_, r) => {
         const p = r.partials?.find(p => p.type === 'Practical');
         if (!p) return '-';

         if (p.status === 'NotYet') return <Tag color="default">Not Yet</Tag>;

         if (p.isPass === true) return <Tag color="success">PASS</Tag>;
         if (p.isPass === false) return <Tag color="error">FAIL</Tag>;
         return '-';
      }
    },
    {
      title: 'Status',
      width: '15%',
      render: (_, r) => {
          const p = r.partials?.find(p => p.type === 'Practical');
          let statusText = p?.status || 'Pending';
          let color = 'default';

          if (p?.status === 'Approved') color = 'green';
          else if (p?.status === 'Submitted') color = 'orange';

          if (statusText === 'NotYet') statusText = 'Not Yet';

          return <Tag color={color}>{statusText}</Tag>;
      }
    },
    {
        title: 'Action',
        key: 'action',
        width: '10%',
        render: (_, record) => (
            <Button type="primary" size="small" ghost onClick={() => handleOpenGrading(record)}>
                Grade
            </Button>
        )
    }
  ];

  return (
    <div className="py-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
           <span className="text-lg font-bold">{t('instructor.finalExam.peTitle')}</span>
        </div>
        {configs.length === 0 && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenConfig(null)}>
            {t('instructor.finalExam.createExam')}
          </Button>
        )}
      </div>
      
      <Table columns={configColumns} dataSource={configs} rowKey="type" pagination={false} loading={loading} />
      
      {/* --- Create/Edit Configuration Modal --- */}
      <Modal 
        open={createModalOpen} 
        onOk={handleSaveConfig} 
        onCancel={() => setCreateModalOpen(false)} 
        title="Configure Practical Exam"
        width={700}
      >
        <Form form={form} layout="vertical">
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="duration" label="Duration (minutes)" rules={[{ required: true }]}><InputNumber min={1} className="w-full" /></Form.Item>
            <Form.Item name="examWeight" label="Weight (%)" rules={[{ required: true }]}><InputNumber min={0} max={100} className="w-full" /></Form.Item>
          </div>
          <Form.Item name="timeRange" label="Valid Time Range"><DatePicker.RangePicker showTime className="w-full" /></Form.Item>
          
          <Divider orientation="left">Checklist Template</Divider>
          
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
                            <Input placeholder="Criteria Name (e.g. Safety Check)" />
                         </Form.Item>
                         <Form.Item
                            {...restField}
                            name={[name, 'description']}
                            className="flex-1 mb-0"
                         >
                            <Input placeholder="Description (Optional)" />
                         </Form.Item>
                         <MinusCircleOutlined className="mt-2 text-red-500 cursor-pointer" onClick={() => remove(name)} />
                    </div>
                ))}
                <Form.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                    Add Criteria
                    </Button>
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
        width={900} 
        title="Student Practical Exams"
      >
        <Table dataSource={studentExams} columns={studentColumns} rowKey="id" />
      </Modal>

      {/* --- Grading Modal --- */}
      <Modal
        open={gradingModalOpen}
        onOk={handleSubmitGrade}
        onCancel={() => setGradingModalOpen(false)}
        title={`Grading: ${currentTraineeName}`}
        width={600}
        okText="Submit Grade"
      >
        <Form form={gradingForm} layout="vertical">
             <Divider orientation="left" className="mt-0">Performance Checklist</Divider>
             <div className="max-h-[400px] overflow-y-auto pr-2">
                 <Form.List name="checklist">
                    {(fields) => (
                        <div>
                            {fields.map((field, index) => {
                                // Get the current value to display info (Form.List doesn't pass value directly)
                                const currentItem = gradingForm.getFieldValue(['checklist', index]);
                                return (
                                    <Card key={field.key} size="small" className="mb-2 bg-gray-50">
                                        <div className="flex justify-between items-center">
                                            <div className="flex-1">
                                                <div className="font-semibold">{currentItem?.name}</div>
                                                {currentItem?.description && <div className="text-xs text-gray-500">{currentItem.description}</div>}
                                                {/* Hidden ID field to keep track */}
                                                <Form.Item name={[field.name, 'id']} hidden><Input /></Form.Item>
                                                <Form.Item name={[field.name, 'name']} hidden><Input /></Form.Item>
                                                <Form.Item name={[field.name, 'description']} hidden><Input /></Form.Item>
                                            </div>
                                            <Form.Item name={[field.name, 'isPass']} valuePropName="checked" className="mb-0">
                                                <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
                                            </Form.Item>
                                        </div>
                                    </Card>
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
                label={<span className="font-bold text-lg">Overall Result</span>}
                className="bg-blue-50 p-4 rounded border border-blue-100"
             >
                 <Switch 
                    checkedChildren="PASS" 
                    unCheckedChildren="FAIL" 
                    className="bg-gray-300" 
                    style={{ width: 100 }}
                 />
             </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}