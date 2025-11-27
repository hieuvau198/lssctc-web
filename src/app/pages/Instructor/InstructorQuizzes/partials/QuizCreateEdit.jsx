import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  Button,
  InputNumber,
  Checkbox,
  message,
  Skeleton,
  Alert,
  Modal,
  App,
} from 'antd';
import {
  ArrowLeft,
  Trash2,
  Plus,
  AlertCircle,
  Save,
  X,
  CheckCircle,
  HelpCircle,
  Clock,
  Target,
  FileText,
  Award
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { createQuizWithQuestions, updateQuizWithQuestions, getQuizDetail } from '../../../../apis/Instructor/InstructorQuiz';

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
      icon: <AlertCircle className="text-red-500" />,
      content: errorMessage,
      okText: 'Close',
      centered: true,
      okButtonProps: { className: 'bg-red-500 hover:bg-red-600' }
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

      // Call create or update API based on mode
      const response = isEditMode
        ? await updateQuizWithQuestions(id, payload)
        : await createQuizWithQuestions(payload);

      // Handle success response
      modal.success({
        title: 'Success',
        icon: <CheckCircle className="text-emerald-500" />,
        content: response?.message || (isEditMode ? 'Quiz updated successfully' : 'Quiz created successfully'),
        okText: 'OK',
        centered: true,
        okButtonProps: { className: 'bg-blue-600 hover:bg-blue-700' },
        onOk: () => {
          navigate('/instructor/quizzes');
        }
      });

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
      <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
          <Skeleton active paragraph={{ rows: 10 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 p-8 font-sans">
        <div className="max-w-4xl mx-auto">
          <Button
            type="text"
            icon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/instructor/quizzes')}
            className="mb-4 flex items-center gap-2 text-gray-600 hover:text-blue-600"
          >
            Back to Quizzes
          </Button>
          <Alert type="error" message="Error" description={error} showIcon className="rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-8 font-sans animate-in fade-in duration-500">
      <div className="w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div
              onClick={() => navigate('/instructor/quizzes')}
              className="flex items-center gap-2 text-sm font-medium text-blue-600 mb-1 cursor-pointer hover:underline w-fit"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="uppercase tracking-wider text-xs">Back to Quizzes</span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
            </h1>
            <p className="text-lg text-gray-500 max-w-2xl">
              {isEditMode ? 'Update quiz details and questions.' : 'Set up a new quiz with questions and answers.'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="large"
              onClick={() => navigate('/instructor/quizzes')}
              className="!flex !items-center !gap-2 !h-12 !px-6 !rounded-xl !font-bold !text-gray-600 hover:!text-gray-900 hover:!bg-gray-100 transition-all duration-300"
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              loading={submitting}
              onClick={() => form.submit()}
              icon={<Save className="w-4 h-4" />}
              className="!flex !items-center !gap-2 !h-12 !px-6 !rounded-xl !font-bold !bg-blue-600 hover:!bg-blue-700 !shadow-lg !shadow-blue-600/30 transition-all duration-300 hover:!scale-105"
            >
              {isEditMode ? 'Save Changes' : 'Create Quiz'}
            </Button>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            passScoreCriteria: 5,
            timelimitMinute: 20,
          }}
          className="space-y-8"
        >
          {/* Basic Info Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Form.Item
                label={<span className="font-bold text-gray-700">Quiz Name</span>}
                name="name"
                rules={[{ required: true, message: 'Please enter quiz name' }]}
                className="md:col-span-2"
              >
                <Input
                  size="large"
                  placeholder="e.g., Basic Safety Knowledge"
                  className="rounded-xl"
                />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold text-gray-700">Description</span>}
                name="description"
                className="md:col-span-2"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Describe the purpose of this quiz"
                  className="rounded-xl"
                />
              </Form.Item>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-gray-700 text-sm">Scoring Rules</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label={<span className="font-semibold text-gray-600 text-xs uppercase">Pass Score</span>}
                    name="passScoreCriteria"
                    rules={[{ required: true, message: 'Required' }]}
                    className="mb-0"
                  >
                    <InputNumber min={1} max={100} size="large" className="w-full rounded-xl" />
                  </Form.Item>
                  <Form.Item
                    label={<span className="font-semibold text-gray-600 text-xs uppercase">Total Score</span>}
                    className="mb-0"
                  >
                    <Input value="10" disabled size="large" className="rounded-xl bg-gray-100 text-gray-500 font-bold" />
                  </Form.Item>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="font-bold text-gray-700 text-sm">Time Settings</span>
                </div>
                <Form.Item
                  label={<span className="font-semibold text-gray-600 text-xs uppercase">Time Limit (Minutes)</span>}
                  name="timelimitMinute"
                  rules={[{ required: true, message: 'Required' }]}
                  className="mb-0"
                >
                  <InputNumber min={1} max={180} size="large" className="w-full rounded-xl" />
                </Form.Item>
              </div>
            </div>
          </div>

          {/* Score Summary Bar */}
          <div className="sticky top-4 z-10 bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-blue-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Questions</p>
                <p className="text-xl font-extrabold text-gray-900">{questions.length}</p>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Current Total</p>
                <p className={`text-xl font-extrabold ${Math.abs(questions.reduce((sum, q) => sum + (q.questionScore || 0), 0) - 10) < 0.01 ? 'text-emerald-600' : 'text-amber-500'}`}>
                  {questions.reduce((sum, q) => sum + (q.questionScore || 0), 0).toFixed(2)}
                </p>
              </div>
              <div className="h-8 w-px bg-gray-200"></div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Remaining</p>
                <p className={`text-xl font-extrabold ${Math.abs(questions.reduce((sum, q) => sum + (q.questionScore || 0), 0) - 10) < 0.01 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {(10 - questions.reduce((sum, q) => sum + (q.questionScore || 0), 0)).toFixed(2)}
                </p>
              </div>
            </div>

            {Math.abs(questions.reduce((sum, q) => sum + (q.questionScore || 0), 0) - 10) > 0.01 && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold animate-pulse">
                <AlertCircle className="w-4 h-4" />
                Total score must be exactly 10
              </div>
            )}
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((question, qIdx) => (
              <div key={qIdx} className="bg-white rounded-[2rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100 group hover:border-blue-200 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 font-bold text-sm">
                      {qIdx + 1}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900">Question {qIdx + 1}</h3>
                  </div>
                  <Button
                    type="text"
                    danger
                    icon={<Trash2 className="w-4 h-4" />}
                    onClick={() => removeQuestion(qIdx)}
                    className="flex items-center gap-2 hover:bg-rose-50 rounded-lg"
                  >
                    Remove
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
                  <div className="md:col-span-8">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Question Text</label>
                    <Input
                      size="large"
                      value={question.name}
                      onChange={(e) => updateQuestion(qIdx, 'name', e.target.value)}
                      placeholder="Enter your question here..."
                      className="rounded-xl"
                    />
                  </div>
                  <div className="md:col-span-4">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Score (Points)</label>
                    <InputNumber
                      size="large"
                      className="w-full rounded-xl"
                      value={question.questionScore}
                      onChange={(value) => updateQuestion(qIdx, 'questionScore', value)}
                      min={0.1}
                      max={10}
                      step={0.1}
                      status={scoreErrors[qIdx] ? 'error' : ''}
                    />
                    {scoreErrors[qIdx] && (
                      <p className="text-xs text-rose-500 mt-1 font-medium">{scoreErrors[qIdx]}</p>
                    )}
                  </div>
                  <div className="md:col-span-12">
                    <label className="block text-sm font-bold text-gray-700 mb-2">Description (Optional)</label>
                    <Input.TextArea
                      rows={2}
                      value={question.description}
                      onChange={(e) => updateQuestion(qIdx, 'description', e.target.value)}
                      placeholder="Add extra context or instructions..."
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="bg-gray-50/50 rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      Answer Options
                    </label>
                    <Button
                      type="dashed"
                      size="small"
                      icon={<Plus className="w-3 h-3" />}
                      onClick={() => addOption(qIdx)}
                      className="flex items-center gap-1 text-xs font-bold text-blue-600 border-blue-200 hover:border-blue-400 hover:text-blue-700"
                    >
                      Add Option
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {question.options.map((option, oIdx) => {
                      const optionScore = getOptionScore(qIdx, option.isCorrect);
                      return (
                        <div
                          key={oIdx}
                          className={`p-4 rounded-xl border-2 transition-all duration-200 ${option.isCorrect
                              ? 'bg-emerald-50/30 border-emerald-100'
                              : 'bg-white border-gray-100'
                            }`}
                        >
                          <div className="flex items-start gap-4">
                            <div className="pt-2">
                              <Checkbox
                                checked={option.isCorrect}
                                onChange={(e) => updateOption(qIdx, oIdx, 'isCorrect', e.target.checked)}
                                className="scale-125"
                              />
                            </div>
                            <div className="flex-1 space-y-3">
                              <Input
                                value={option.name}
                                onChange={(e) => updateOption(qIdx, oIdx, 'name', e.target.value)}
                                placeholder={`Option ${oIdx + 1}`}
                                className={`rounded-lg ${option.isCorrect ? 'font-medium text-emerald-900' : ''}`}
                                prefix={<span className="text-xs font-bold text-gray-400 mr-2">{String.fromCharCode(65 + oIdx)}</span>}
                              />
                              <Input
                                size="small"
                                value={option.explanation}
                                onChange={(e) => updateOption(qIdx, oIdx, 'explanation', e.target.value)}
                                placeholder="Explanation (optional)"
                                prefix={<HelpCircle className="w-3 h-3 text-gray-400" />}
                                className="rounded-lg text-xs bg-transparent border-transparent hover:bg-white hover:border-gray-200 focus:bg-white focus:border-blue-500 transition-all"
                              />
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Button
                                type="text"
                                danger
                                size="small"
                                icon={<X className="w-4 h-4" />}
                                onClick={() => removeOption(qIdx, oIdx)}
                                className="opacity-50 hover:opacity-100"
                              />
                              {option.isCorrect && (
                                <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">
                                  {optionScore.toFixed(2)} pts
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="dashed"
            block
            size="large"
            icon={<Plus className="w-5 h-5" />}
            onClick={addQuestion}
            className="h-16 rounded-2xl border-2 border-gray-200 text-gray-500 font-bold hover:border-blue-400 hover:text-blue-600 transition-all duration-300"
          >
            Add New Question
          </Button>
        </Form>
      </div>
    </div>
  );
}
