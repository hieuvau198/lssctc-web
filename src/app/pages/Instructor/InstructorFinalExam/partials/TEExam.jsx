import { Card, Table, Button, Tag, Space, Modal, Form, Input, InputNumber, App } from 'antd';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useFinalExams } from '../../../../hooks/instructor/useFinalExams';

export default function TEExam({ classId }) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const { exams, loading, createExam, updateExam, deleteExam, loadExams } = useFinalExams(classId);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();

  // Filter only TE (Theory Exam) type exams
  const teExams = exams.filter(exam => exam.type === 'TE' || exam.name?.includes('Theory'));

  const columns = [
    {
      title: t('instructor.finalExam.examName'),
      dataIndex: 'name',
      key: 'name',
      width: 250,
    },
    {
      title: t('instructor.finalExam.totalQuestions'),
      dataIndex: 'totalQuestions',
      key: 'totalQuestions',
      width: 150,
      align: 'center',
    },
    {
      title: t('instructor.finalExam.duration'),
      dataIndex: 'duration',
      key: 'duration',
      width: 100,
      align: 'center',
      render: (val) => `${val} ${t('common.minutes')}`,
    },
    {
      title: t('instructor.finalExam.passingScore'),
      dataIndex: 'passingScore',
      key: 'passingScore',
      width: 150,
      align: 'center',
    },
    {
      title: t('common.status'),
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={status === 'Active' ? 'green' : 'default'}>
          {status === 'Active' ? t('common.active') : t('common.inactive')}
        </Tag>
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 180,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
          >
            {t('common.view')}
          </Button>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            {t('common.edit')}
          </Button>
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          >
            {t('common.delete')}
          </Button>
        </Space>
      ),
    },
  ];

  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalOpen(true);
  };

  const handleView = (record) => {
    message.info(t('instructor.finalExam.viewExam'));
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: t('instructor.finalExam.deleteConfirm'),
      content: t('instructor.finalExam.deleteConfirmDesc'),
      okText: t('common.confirm'),
      cancelText: t('common.cancel'),
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteExam(record.id);
          message.success(t('instructor.finalExam.deleteSuccess'));
        } catch (err) {
          message.error(err.message || 'Failed to delete exam');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Prepare payload with required fields
      const payload = {
        ...values,
        type: 'TE', // Theory Exam type
        classId: classId,
        status: values.status || 'Active',
      };

      if (editingRecord) {
        // Update existing exam
        await updateExam(editingRecord.id, payload);
        message.success(t('instructor.finalExam.updateSuccess'));
      } else {
        // Create new exam
        await createExam(payload);
        message.success(t('instructor.finalExam.createSuccess'));
      }
      
      setModalOpen(false);
      form.resetFields();
    } catch (err) {
      console.error('Failed to save exam:', err);
      message.error(err.message || 'Failed to save exam');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className="text-lg font-semibold text-slate-800">
            {t('instructor.finalExam.teTitle')}
          </span>
          <p className="text-sm text-slate-500">{t('instructor.finalExam.teDescription')}</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          {t('instructor.finalExam.createExam')}
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={teExams}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: t('instructor.finalExam.noExams') }}
        scroll={{ y: 400 }}
      />

      <Modal
        title={
          editingRecord
            ? t('instructor.finalExam.editExam')
            : t('instructor.finalExam.createExam')
        }
        open={modalOpen}
        onOk={handleModalOk}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
          setEditingRecord(null);
        }}
        confirmLoading={submitting}
        width={600}
        okText={t('common.save')}
        cancelText={t('common.cancel')}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            name="name"
            label={t('instructor.finalExam.examName')}
            rules={[{ required: true, message: t('instructor.finalExam.examNameRequired') }]}
          >
            <Input placeholder={t('instructor.finalExam.examNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            name="totalQuestions"
            label={t('instructor.finalExam.totalQuestions')}
            rules={[{ required: true, message: t('instructor.finalExam.totalQuestionsRequired') }]}
          >
            <InputNumber min={1} max={100} className="w-full" />
          </Form.Item>

          <Form.Item
            name="duration"
            label={`${t('instructor.finalExam.duration')} (${t('common.minutes')})`}
            rules={[{ required: true, message: t('instructor.finalExam.durationRequired') }]}
          >
            <InputNumber min={1} max={180} className="w-full" />
          </Form.Item>

          <Form.Item
            name="passingScore"
            label={t('instructor.finalExam.passingScore')}
            rules={[{ required: true, message: t('instructor.finalExam.passingScoreRequired') }]}
          >
            <InputNumber min={0} max={10} step={0.5} className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
