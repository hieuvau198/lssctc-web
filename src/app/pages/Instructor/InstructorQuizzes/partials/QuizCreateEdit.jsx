import React, { useEffect, useState } from 'react';
import {
  Card,
  Form,
  Input,
  Button,
  InputNumber,
  Checkbox,
  Divider,
  message,
  Skeleton,
  Alert,
  Space,
  Modal,
  App,
} from 'antd';
import { ArrowLeftOutlined, DeleteOutlined, PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router';
import { createQuizWithQuestions, getQuizDetail } from '../../../../apis/Instructor/InstructorQuiz';

export default function QuizCreateEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { modal } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(id ? true : false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [scoreErrors, setScoreErrors] = useState({});
  const [questions, setQuestions] = useState([
    { id: 1, name: '', description: '', isMultipleAnswers: false, questionScore: 10, options: [{ id: 1, name: '', isCorrect: true, explanation: '' }] },
  ]);

  const isEditMode = !!id;

  useEffect(() => {
    if (isEditMode) {
      loadQuiz();
    }
  }, [id]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getQuizDetail(id);
      
      // Set form values
      form.setFieldsValue({
        name: data.name,
        description: data.description,
        passScoreCriteria: data.passScoreCriteria,
        timelimitMinute: data.timelimitMinute,
        totalScore: data.totalScore,
      });

      // Set questions
      if (data.questions && data.questions.length > 0) {
        setQuestions(
          data.questions.map((q, qIdx) => ({
            id: q.id || qIdx,
            name: q.name,
            description: q.description || '',
            isMultipleAnswers: q.isMultipleAnswers || false,
            questionScore: q.questionScore || 1,
            options: (q.options || []).map((opt, oIdx) => ({
              id: opt.id || oIdx,
              name: opt.name,
              isCorrect: opt.isCorrect || false,
              explanation: opt.explanation || '',
              optionScore: opt.optionScore || 0,
            })),
          }))
        );
      }
    } catch (e) {
      console.error('Error loading quiz:', e);
      setError(e?.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const showErrorModal = (title, errorMessage) => {
    modal.error({
      title,
      icon: <ExclamationCircleOutlined />,
      content: errorMessage,
      okText: 'Close',
      centered: true,
    });
  };

  // Calculate option score based on question settings
  const getOptionScore = (qIdx, isOptionCorrect) => {
    const q = questions[qIdx];
    if (!q.questionScore || !isOptionCorrect) return 0;

    // Single choice: correct option gets full question score
    return q.questionScore;
  };

  const validateQuestionScore = (qIdx, score) => {
    if (!score || score <= 0) return null;

    const q = questions[qIdx];
    
    // Check if score has too many decimal places (max 2)
    const scoreStr = score.toString();
    const decimalPart = scoreStr.split('.')[1];
    if (decimalPart && decimalPart.length > 2) {
      return `Score has too many decimal places (${score}). Max 2 decimal places allowed.`;
    }

    return null;
  };

  const onFinish = async (values) => {
    try {
      setError(null);
      
      // Validate questions
      if (!questions || questions.length === 0) {
        showErrorModal('Validation Error', 'Please add at least one question');
        return;
      }

      // Validate each question has options
      for (let q of questions) {
        if (!q.name.trim()) {
          showErrorModal('Validation Error', 'Please fill in all question texts');
          return;
        }

        // Validate question score is valid
        if (!q.questionScore || q.questionScore <= 0) {
          showErrorModal('Validation Error', `Question "${q.name}" must have a valid score greater than 0`);
          return;
        }

        // Check if score has too many decimal places (more than 2 decimals)
        const scoreStr = q.questionScore.toString();
        const decimalPart = scoreStr.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          showErrorModal('Validation Error', `Question "${q.name}" score cannot have more than 2 decimal places. You entered: ${q.questionScore}`);
          return;
        }

        if (!q.options || q.options.length === 0) {
          showErrorModal('Validation Error', `Question "${q.name}" must have at least one option`);
          return;
        }

        // For single choice questions, validate only 1 correct answer
        const correctAnswers = q.options.filter(opt => opt.isCorrect).length;
        if (correctAnswers === 0) {
          showErrorModal('Validation Error', `Question "${q.name}" must have at least one correct answer`);
          return;
        }
        if (correctAnswers > 1) {
          showErrorModal('Validation Error', `Question "${q.name}" can only have one correct answer (single choice)`);
          return;
        }

        // Validate all options have text
        for (let opt of q.options) {
          if (!opt.name.trim()) {
            showErrorModal('Validation Error', `Question "${q.name}" has empty option text`);
            return;
          }
        }

        // Validate at least one correct option (already validated above)
      }

      // Validate total score equals 10
      const totalScore = questions.reduce((sum, q) => sum + (q.questionScore || 0), 0);
      if (Math.abs(totalScore - 10) > 0.01) { // Allow small floating point errors
        showErrorModal(
          'Validation Error',
          `Total quiz score must equal 10 points. Current total: ${totalScore.toFixed(2)} points`
        );
        return;
      }

      setSubmitting(true);

      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        passScoreCriteria: values.passScoreCriteria,
        timelimitMinute: values.timelimitMinute,
        questions: questions.map(q => ({
          name: q.name.trim(),
          description: q.description?.trim() || '',
          isMultipleAnswers: false,
          questionScore: q.questionScore || 10,
          imageUrl: '',
          options: q.options.map(opt => ({
            name: opt.name.trim(),
            description: '',
            isCorrect: opt.isCorrect || false,
            explanation: opt.explanation?.trim() || '',
          })),
        })),
      };

      const response = await createQuizWithQuestions(payload);
      
      // Handle success response
      if (response?.status === 200) {
        modal.success({
          title: 'Success',
          content: response?.message || 'Quiz created successfully',
          okText: 'OK',
          centered: true,
          onOk: () => {
            navigate('/instructor/quizzes');
          }
        });
      } else {
        modal.success({
          title: 'Success',
          content: isEditMode ? 'Quiz updated successfully' : 'Quiz created successfully',
          okText: 'OK',
          centered: true,
          onOk: () => {
            navigate('/instructor/quizzes');
          }
        });
      }
    } catch (e) {
      console.error('Error saving quiz:', e);
      
      let errorMsg = 'Failed to save quiz';
      let errorTitle = 'Error Creating Quiz';
      
      // Handle server error responses
      if (e?.response?.data) {
        const data = e.response.data;
        
        // Type 1: Validation errors with errors object
        if (data.errors && typeof data.errors === 'object') {
          const errorList = [];
          for (const [field, messages] of Object.entries(data.errors)) {
            if (Array.isArray(messages)) {
              errorList.push(`${field}: ${messages[0]}`);
            }
          }
          if (errorList.length > 0) {
            errorMsg = errorList.join('\n');
          }
        }
        // Type 2: Direct message in response
        else if (data.message) {
          errorMsg = data.message;
        }
        // Type 3: Title field (standard error format)
        else if (data.title) {
          errorMsg = data.title;
        }
      }
      // Client error
      else if (e?.message) {
        errorMsg = e.message;
      }
      
      showErrorModal(errorTitle, errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id || 0)) + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        name: '',
        description: '',
        isMultipleAnswers: false,
        questionScore: 10,
        options: [{ id: 1, name: '', isCorrect: true, explanation: '' }],
      },
    ]);
  };

  const removeQuestion = (qIdx) => {
    if (questions.length === 1) {
      message.warning('You must have at least one question');
      return;
    }
    setQuestions(questions.filter((_, idx) => idx !== qIdx));
  };

  const updateQuestion = (qIdx, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx][field] = value;
    
    // If updating score or isMultipleAnswers, validate and update error state
    if (field === 'questionScore' || field === 'isMultipleAnswers') {
      const warning = validateQuestionScore(qIdx, newQuestions[qIdx].questionScore);
      setScoreErrors(prev => ({
        ...prev,
        [qIdx]: warning
      }));
    }
    
    setQuestions(newQuestions);
  };

  const addOption = (qIdx) => {
    const newQuestions = [...questions];
    const newId = Math.max(...(newQuestions[qIdx].options || []).map(o => o.id || 0)) + 1;
    newQuestions[qIdx].options.push({
      id: newId,
      name: '',
      isCorrect: false,
      explanation: '',
    });
    setQuestions(newQuestions);
  };

  const removeOption = (qIdx, oIdx) => {
    const newQuestions = [...questions];
    if (newQuestions[qIdx].options.length === 1) {
      message.warning('Each question must have at least one option');
      return;
    }
    newQuestions[qIdx].options = newQuestions[qIdx].options.filter((_, idx) => idx !== oIdx);
    
    // Re-validate score after changing options
    const warning = validateQuestionScore(qIdx, newQuestions[qIdx].questionScore);
    setScoreErrors(prev => ({
      ...prev,
      [qIdx]: warning
    }));
    
    setQuestions(newQuestions);
  };

  const updateOption = (qIdx, oIdx, field, value) => {
    const newQuestions = [...questions];
    
    // If marking as correct answer, uncheck all other options in same question
    if (field === 'isCorrect' && value === true) {
      newQuestions[qIdx].options = newQuestions[qIdx].options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oIdx ? true : false
      }));
    } else {
      newQuestions[qIdx].options[oIdx][field] = value;
    }
    
    // If updating isCorrect, re-validate score
    if (field === 'isCorrect') {
      const warning = validateQuestionScore(qIdx, newQuestions[qIdx].questionScore);
      setScoreErrors(prev => ({
        ...prev,
        [qIdx]: warning
      }));
    }
    
    setQuestions(newQuestions);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-4">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/instructor/quizzes')}
          className="mb-4"
        >
          Back to Quizzes
        </Button>
        <Alert type="error" message="Error" description={error} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <Button 
        type="text" 
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/instructor/quizzes')}
        className="mb-4"
      >
        Back to Quizzes
      </Button>

      {error && (
        <Alert 
          type="error" 
          message="Error" 
          description={error}
          closable
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <Card title={isEditMode ? 'Edit Quiz' : 'Create New Quiz'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            passScoreCriteria: 5,
            timelimitMinute: 20,
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="Quiz Name"
              name="name"
              rules={[{ required: true, message: 'Please enter quiz name' }]}
            >
              <Input placeholder="e.g., Basic Safety Knowledge" />
            </Form.Item>

            <Form.Item
              label="Total Score"
            >
              <Input 
                value="10" 
                disabled 
                placeholder="Fixed at 10 points"
              />
            </Form.Item>

            <Form.Item
              label="Pass Score Criteria"
              name="passScoreCriteria"
              rules={[{ required: true, message: 'Please enter pass score' }]}
            >
              <InputNumber min={1} max={100} />
            </Form.Item>

            <Form.Item
              label="Time Limit (minutes)"
              name="timelimitMinute"
              rules={[{ required: true, message: 'Please enter time limit' }]}
            >
              <InputNumber min={1} max={180} />
            </Form.Item>
          </div>

          <Form.Item
            label="Description"
            name="description"
          >
            <Input.TextArea 
              rows={3}
              placeholder="Describe the purpose of this quiz"
            />
          </Form.Item>

          <Divider>Questions</Divider>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">Total Questions</p>
                <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Total Quiz Score</p>
                <p className="text-2xl font-bold text-green-600">
                  {questions.reduce((sum, q) => sum + (q.questionScore || 0), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Per Question Avg</p>
                <p className="text-2xl font-bold text-purple-600">
                  {questions.length > 0 ? (questions.reduce((sum, q) => sum + (q.questionScore || 0), 0) / questions.length).toFixed(2) : '0'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">Remaining Score</p>
                <p className="text-2xl font-bold" style={{
                  color: Math.abs(questions.reduce((sum, q) => sum + (q.questionScore || 0), 0) - 10) < 0.01 ? '#22c55e' : '#ef4444'
                }}>
                  {(10 - questions.reduce((sum, q) => sum + (q.questionScore || 0), 0)).toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ℹ️ Total quiz score must equal exactly 10 points to create quiz
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, qIdx) => (
              <Card
                key={qIdx}
                title={`Question ${qIdx + 1}`}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeQuestion(qIdx)}
                  >
                    Remove
                  </Button>
                }
                className="bg-gray-50"
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Text</label>
                      <Input
                        value={question.name}
                        onChange={(e) => updateQuestion(qIdx, 'name', e.target.value)}
                        placeholder="Enter question text"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Score</label>
                      <InputNumber
                        className="w-full"
                        value={question.questionScore}
                        onChange={(value) => updateQuestion(qIdx, 'questionScore', value)}
                        min={0.1}
                        max={10}
                        step={0.1}
                        status={scoreErrors[qIdx] ? 'error' : ''}
                      />
                      {scoreErrors[qIdx] && (
                        <p className="text-xs text-red-600 mt-1">❌ {scoreErrors[qIdx]}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <Input.TextArea
                      rows={2}
                      value={question.description}
                      onChange={(e) => updateQuestion(qIdx, 'description', e.target.value)}
                      placeholder="Optional question description"
                    />
                  </div>

                  <Divider className="my-3" />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">Answer Options</label>
                      <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => addOption(qIdx)}
                      >
                        Add Option
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {question.options.map((option, oIdx) => {
                        const optionScore = getOptionScore(qIdx, option.isCorrect);
                        return (
                        <div key={oIdx} className="p-3 bg-white border border-gray-200 rounded">
                          <div className="mb-2">
                            <Input
                              value={option.name}
                              onChange={(e) => updateOption(qIdx, oIdx, 'name', e.target.value)}
                              placeholder={`Option ${oIdx + 1}`}
                            />
                          </div>

                          <div className="mb-2 flex gap-2 items-center justify-between">
                            <div className="flex gap-2 items-center">
                              <Checkbox
                                checked={option.isCorrect}
                                onChange={(e) => updateOption(qIdx, oIdx, 'isCorrect', e.target.checked)}
                              >
                                Mark as Correct Answer
                              </Checkbox>
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<DeleteOutlined />}
                                onClick={() => removeOption(qIdx, oIdx)}
                              />
                            </div>
                            <div className="text-sm font-semibold px-2 py-1 rounded" style={{
                              backgroundColor: option.isCorrect ? '#d4edda' : '#f8f9fa',
                              color: option.isCorrect ? '#155724' : '#6c757d'
                            }}>
                              Score: {optionScore.toFixed(2)}
                            </div>
                          </div>

                          <Input.TextArea
                            rows={2}
                            value={option.explanation}
                            onChange={(e) => updateOption(qIdx, oIdx, 'explanation', e.target.value)}
                            placeholder="Explanation for this answer (optional)"
                          />
                        </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            type="dashed"
            block
            icon={<PlusOutlined />}
            onClick={addQuestion}
            className="mt-4 h-10"
          >
            Add Question
          </Button>

          <Divider />

          <Space className="mt-4">
            <Button 
              type="primary"
              loading={submitting}
              htmlType="submit"
            >
              {isEditMode ? 'Update Quiz' : 'Create Quiz'}
            </Button>
            <Button onClick={() => navigate('/instructor/quizzes')}>
              Cancel
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
