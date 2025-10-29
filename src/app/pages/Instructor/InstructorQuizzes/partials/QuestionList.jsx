import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { App, Badge, Button, Card, Form, Input, InputNumber, Modal, Popconfirm, Switch, Table, Tag, Tooltip, Pagination } from 'antd';
import { useEffect, useState } from 'react';
import { deleteQuizQuestion, getQuizQuestions, updateQuizQuestion } from '../../../../apis/Instructor/InstructorQuiz';
import OptionList from './OptionList';

export default function QuestionList({ quizId }) {
  const { message } = App.useApp();
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
      render: (_, __, idx) => (page - 1) * pageSize + idx + 1,
    },
    {
      title: 'Question',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (name) => <span className="font-medium">{name}</span>,
    },
    {
      title: 'Type',
      dataIndex: 'isMultipleAnswers',
      key: 'type',
      width: 150,
      align: 'center',
      render: (isMultiple) => (
        <Tag color={isMultiple ? 'purple' : 'blue'}>
          {isMultiple ? 'Multiple Choice' : 'Single Choice'}
        </Tag>
      ),
    },
    {
      title: 'Score',
      dataIndex: 'questionScore',
      key: 'score',
      width: 100,
      align: 'center',
      render: (score) => (
        <Badge count={score} showZero color="blue" className="font-medium" />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      align: 'center',
      render: (_, record) => (
        <div className="flex gap-2 justify-center">
          <Tooltip title="Edit Question">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEditQuestion(record)}
              size="small"
              className="hover:bg-yellow-50 hover:text-yellow-600"
            />
          </Tooltip>
          <Popconfirm
            title="Delete Question"
            description="Are you sure you want to delete this question?"
            onConfirm={() => handleDeleteQuestion(record.id)}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ danger: true }}
          >
            <Tooltip title="Delete Question">
              <Button
                type="text"
                icon={<DeleteOutlined />}
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
        <Card title={`Questions`} className="h-auto flex flex-col overflow-hidden">
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
              showTotal={(t, range) => `${range[0]}-${range[1]} of ${t} questions`}
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
        title="Edit Question"
        open={editModalVisible}
        onOk={handleUpdateQuestion}
        onCancel={handleCancelEdit}
        width={600}
      >
        <Form form={form} layout="vertical" className="mt-4">
          <Form.Item
            label="Question Name"
            name="name"
            rules={[{ required: true, message: 'Please enter question name' }]}
          >
            <Input
              maxLength={100}
              showCount
              placeholder="Enter question name"
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
              label="Multiple Answers"
              name="isMultipleAnswers"
              valuePropName="checked"
              className="flex-none w-1/2 flex items-center"
            >
              <Switch checkedChildren="Yes" unCheckedChildren="No" />
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea
              rows={3}
              placeholder="Enter question description (optional)"
              maxLength={500}
              showCount
            />
          </Form.Item>

        </Form>
      </Modal>
    </>
  );
}
