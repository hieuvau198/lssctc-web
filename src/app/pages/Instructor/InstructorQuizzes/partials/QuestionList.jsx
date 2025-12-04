import { CheckCircle, XCircle, Trash2, Pencil } from 'lucide-react';
import { App, Badge, Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Switch, Table, Tag, Tooltip, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { deleteQuizQuestion, getQuizQuestions, updateQuizQuestion } from '../../../../apis/Instructor/InstructorQuiz';
import OptionList from './OptionList';

export default function QuestionList({ quizId }) {
  const { message } = App.useApp();
  const { t } = useTranslation();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    loadQuestions();
  }, [quizId, page, pageSize]);

  const loadQuestions = async () => {
    if (!quizId) return;

    setLoading(true);
    try {
      const data = await getQuizQuestions(quizId, { page, pageSize });
      setQuestions(data.items || []);
      setTotal(data.totalCount || 0);
    } catch (e) {
      console.error('Failed to load questions:', e);
      message.error('Failed to load questions');
      setQuestions([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleExpand = (expanded, record) => {
    const keys = expanded
      ? [...expandedRowKeys, record.id]
      : expandedRowKeys.filter((key) => key !== record.id);
    setExpandedRowKeys(keys);
    // Option fetching is handled inside OptionList
  };

  const handleEditQuestion = (record) => {
    setEditingQuestion(record);
    form.setFieldsValue({
      name: record.name,
      questionScore: record.questionScore,
      description: record.description,
      isMultipleAnswers: record.isMultipleAnswers,
    });
    setEditModalVisible(true);
  };

  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuizQuestion(questionId);
      message.success('Question deleted successfully');
      loadQuestions(); // Reload the list
    } catch (e) {
      console.error('Failed to delete question:', e);
      message.error('Failed to delete question');
    }
  };

  const handleUpdateQuestion = async () => {
    try {
      const values = await form.validateFields();
      await updateQuizQuestion(editingQuestion.id, values);
      setEditModalVisible(false);
      setEditingQuestion(null);
      form.resetFields();
      loadQuestions(); // Reload the list
      await message.success('Question updated successfully');
    } catch (e) {
      console.error('Failed to update question:', e);
      message.error('Failed to update question');
    }
  };

  const handleCancelEdit = () => {
    setEditModalVisible(false);
    setEditingQuestion(null);
    form.resetFields();
  };
  const expandedRowRender = (record) => <OptionList questionId={record.id} />;

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, idx) => (page - 1) * pageSize + idx + 1,
    },
    {
      title: t('instructor.quizzes.questions.question'),
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: t('instructor.quizzes.table.type'),
      dataIndex: 'isMultipleAnswers',
      key: 'type',
      width: 150,
      align: 'center',
      render: (isMultiple) => (
        <Tag color={isMultiple ? 'purple' : 'blue'}>
          {isMultiple ? t('instructor.quizzes.multipleChoice') : t('instructor.quizzes.singleChoice')}
        </Tag>
      ),
    },
    {
      title: t('instructor.quizzes.questions.score'),
      dataIndex: 'questionScore',
      key: 'score',
      width: 100,
      align: 'center',
      render: (score) => (
        <Badge count={score} showZero color="blue" className="font-medium" />
      ),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title={t('instructor.quizzes.editQuestion')}>
            <Button
              type="text"
              icon={<Pencil className="w-4 h-4" />}
              onClick={() => handleEditQuestion(record)}
              size="small"
              className="hover:bg-yellow-50 hover:text-yellow-600"
            />
          </Tooltip>
          <Popconfirm
            title={t('instructor.quizzes.deleteQuestion')}
            description={t('instructor.quizzes.deleteQuestionConfirm')}
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText={t('common.yes')}
            cancelText={t('common.no')}
            okButtonProps={{ danger: true }}
          >
            <Tooltip title={t('instructor.quizzes.deleteQuestion')}>
              <Button
                type="text"
                icon={<Trash2 className="w-4 h-4" />}
                size="small"
                danger
              />
            </Tooltip>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="shadow-xl rounded-2xl overflow-hidden">
        <Card title={t('instructor.quizzes.questions.title')} className="h-auto flex flex-col overflow-hidden">
          <div className="flex-1 min-h-0">
            <Table
              columns={columns}
              dataSource={questions}
              rowKey="id"
              loading={loading}
              expandable={{
                expandedRowRender,
                expandedRowKeys,
                onExpand: handleExpand,
              }}
              pagination={false}
              size="middle"
              scroll={{ x: 900, y: 360 }}
            />
          </div>

          <div className="pt-3 border-t border-gray-200 flex justify-center">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={total}
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
              showTotal={(total, range) => t('instructor.quizzes.pagination.showTotal', { start: range[0], end: range[1], total })}
              onChange={(p, ps) => {
                setPage(p);
                setPageSize(ps);
                loadQuestions();
              }}
            />
          </div>
        </Card>
      </div>

      <Modal
        title={t('instructor.quizzes.editQuestion')}
        open={editModalVisible}
        onOk={handleUpdateQuestion}
        onCancel={handleCancelEdit}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label={t('instructor.quizzes.questions.questionName')}
            name="name"
            rules={[{ required: true, message: t('instructor.quizzes.validation.questionNameRequired') }]}
          >
            <Input
              maxLength={100}
              showCount
              placeholder={t('instructor.quizzes.questions.enterQuestion')}
            />
          </Form.Item>

          {/* Score and Multiple Answers on the same row, symmetric */}
          <div className="flex gap-4">
            {/* <Form.Item
              label="Question Score"
              name="questionScore"
              rules={[{ required: true, message: 'Please enter question score' }]}
              className="flex-1"
            >
              <InputNumber
                min={0}
                max={10}
                step={0.1}
                placeholder="Enter score"
                className="w-full"
              />
            </Form.Item> */}

            <Form.Item
              label={t('instructor.quizzes.multipleAnswers')}
              name="isMultipleAnswers"
              valuePropName="checked"
              className="flex-none w-1/2 flex items-center"
            >
              <Switch checkedChildren={t('common.yes')} unCheckedChildren={t('common.no')} />
            </Form.Item>
          </div>

          <Form.Item
            label={t('instructor.quizzes.questions.description')}
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder={t('instructor.quizzes.questions.descriptionPlaceholder')}
              maxLength={500}
              showCount
            />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}
