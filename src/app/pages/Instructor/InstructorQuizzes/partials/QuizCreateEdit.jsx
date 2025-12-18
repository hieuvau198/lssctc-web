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
import { ArrowLeft, Trash2, Plus, Save, FileText, Target, Star, List, HelpCircle, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { createQuizWithQuestions, updateQuizWithQuestions, getQuizDetail } from '../../../../apis/Instructor/InstructorQuiz';

export default function QuizCreateEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { modal } = App.useApp();
  const { t } = useTranslation();
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
      setError(e?.message || t('instructor.quizzes.messages.loadQuizFailed'));
    } finally {
      setLoading(false);
    }
  };

  const showErrorModal = (title, errorMessage) => {
    modal.error({
      title,
      icon: <ExclamationCircleOutlined />,
      content: errorMessage,
      okText: t('common.close'),
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
      return t('instructor.quizzes.validation.scoreTooManyDecimals', { score });
    }

    return null;
  };

  const onFinish = async (values) => {
    try {
      setError(null);

      // Validate questions
      if (!questions || questions.length === 0) {
        showErrorModal(t('instructor.quizzes.modal.validationError'), t('instructor.quizzes.validation.addAtLeastOneQuestion'));
        return;
      }

      // Validate each question has options
      for (let q of questions) {
        if (!q.name.trim()) {
          showErrorModal(t('instructor.quizzes.modal.validationError'), t('instructor.quizzes.validation.fillAllQuestionTexts'));
          return;
        }

        // Validate question score is valid
        if (!q.questionScore || q.questionScore <= 0) {
          showErrorModal(t('instructor.quizzes.modal.validationError'), t('instructor.quizzes.validation.questionMustHaveScore', { name: q.name }));
          return;
        }

        // Check if score has too many decimal places (more than 2 decimals)
        const scoreStr = q.questionScore.toString();
        const decimalPart = scoreStr.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          showErrorModal(t('instructor.quizzes.modal.validationError'), t('instructor.quizzes.validation.questionScoreMaxDecimals', { name: q.name, score: q.questionScore }));
          return;
        }

        if (!q.options || q.options.length === 0) {
          showErrorModal(t('instructor.quizzes.modal.validationError'), t('instructor.quizzes.validation.questionMustHaveOption', { name: q.name }));
          return;
        }

        // For single choice questions, validate only 1 correct answer
        const correctAnswers = q.options.filter(opt => opt.isCorrect).length;
        if (correctAnswers === 0) {
          showErrorModal(t('instructor.quizzes.modal.validationError'), t('instructor.quizzes.validation.questionMustHaveCorrectAnswer', { name: q.name }));
          return;
        }
        if (correctAnswers > 1) {
          showErrorModal(t('instructor.quizzes.modal.validationError'), t('instructor.quizzes.validation.questionOnlyOneCorrectAnswer', { name: q.name }));
          return;
        }

        // Validate all options have text
        for (let opt of q.options) {
          if (!opt.name.trim()) {
            showErrorModal(t('instructor.quizzes.modal.validationError'), t('instructor.quizzes.validation.questionHasEmptyOption', { name: q.name }));
            return;
          }
        }

        // Validate at least one correct option (already validated above)
      }

      // Validate total score equals 10
      const totalScore = questions.reduce((sum, q) => sum + (q.questionScore || 0), 0);
      if (Math.abs(totalScore - 10) > 0.01) { // Allow small floating point errors
        showErrorModal(
          t('instructor.quizzes.modal.validationError'),
          t('instructor.quizzes.validation.totalScoreMustEqual10', { total: totalScore.toFixed(2) })
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
      if (response?.status === 200) {
        modal.success({
          title: t('common.success'),
          content: response?.message || (isEditMode ? t('instructor.quizzes.messages.updateQuizSuccess') : t('instructor.quizzes.messages.createQuizSuccess')),
          okText: t('common.ok'),
          centered: true,
          onOk: () => {
            navigate('/instructor/quizzes');
          }
        });
      } else {
        modal.success({
          title: t('common.success'),
          content: isEditMode ? t('instructor.quizzes.messages.updateQuizSuccess') : t('instructor.quizzes.messages.createQuizSuccess'),
          okText: t('common.ok'),
          centered: true,
          onOk: () => {
            navigate('/instructor/quizzes');
          }
        });
      }
    } catch (e) {
      console.error('Error saving quiz:', e);

      let errorMsg = t('instructor.quizzes.messages.saveQuizFailed');
      let errorTitle = t('instructor.quizzes.modal.errorCreating');

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
      message.warning(t('instructor.quizzes.validation.mustHaveAtLeastOneQuestion'));
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
      message.warning(t('instructor.quizzes.validation.mustHaveAtLeastOneOption'));
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

  const totalScore = questions.reduce((sum, q) => sum + (q.questionScore || 0), 0);
  const remainingScore = 10 - totalScore;
  const isScoreValid = Math.abs(totalScore - 10) < 0.01;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-10 h-10 bg-gray-200 animate-pulse rounded-none" />
          <div className="h-8 w-48 bg-gray-200 animate-pulse rounded-none" />
        </div>
        <div className="bg-white border-2 border-black p-6 mb-6">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-4" />
          <Skeleton active paragraph={{ rows: 6 }} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
        <button
          onClick={() => navigate('/instructor/quizzes')}
          className="group flex items-center gap-2 px-4 py-2 bg-white border-2 border-black font-bold uppercase text-sm hover:bg-neutral-100 transition-all mb-4"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          {t('instructor.quizzes.backToQuizzes')}
        </button>
        <div className="bg-red-50 border-2 border-red-500 p-6 flex flex-col items-center justify-center gap-4">
          <AlertCircle className="w-12 h-12 text-red-500" />
          <span className="font-bold text-red-600 text-lg uppercase tracking-wider">{t('common.error')}: {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 min-h-screen bg-neutral-100">
      <style>{`
          .industrial-form .ant-input, 
          .industrial-form .ant-input-number, 
          .industrial-form .ant-input-textarea {
            border: 2px solid #e5e5e5 !important;
            border-radius: 0 !important;
            font-weight: 500;
          }
          .industrial-form .ant-input:focus, 
          .industrial-form .ant-input-number-focused,
          .industrial-form .ant-input-textarea:focus,
          .industrial-form .ant-input:hover,
          .industrial-form .ant-input-number:hover {
            border-color: #000 !important;
            box-shadow: none !important;
          }
          .industrial-form .ant-input-number-handler-wrap {
            border-radius: 0 !important;
            border-left: 2px solid #000 !important;
          }
          .industrial-form .ant-form-item-label label {
            font-weight: 700;
            text-transform: uppercase;
            font-size: 0.75rem; /* 12px */
            letter-spacing: 0.05em;
          }
      `}</style>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/instructor/quizzes')}
            className="group w-10 h-10 flex items-center justify-center bg-white border-2 border-black hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight flex items-center gap-3">
              <span className="bg-yellow-400 px-2 border-2 border-black text-black">
                {isEditMode ? <FileText className="w-6 h-6" /> : <Plus className="w-6 h-6" />}
              </span>
              {isEditMode ? t('instructor.quizzes.editQuiz') : t('instructor.quizzes.createNewQuiz')}
            </h1>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/instructor/quizzes')}
            className="px-6 py-2 bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-neutral-100 transition-all"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={() => form.submit()}
            disabled={submitting}
            className="px-6 py-2 bg-yellow-400 text-black font-black uppercase text-sm border-2 border-black hover:bg-yellow-500 hover:shadow-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 transition-all disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
          >
            {submitting ? <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            {isEditMode ? t('instructor.quizzes.updateQuiz') : t('instructor.quizzes.createQuiz')}
          </button>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="industrial-form"
        initialValues={{
          passScoreCriteria: 5,
          timelimitMinute: 20,
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Quiz Details */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border-2 border-black">
              <div className="h-1 bg-yellow-400" />
              <div className="p-4 border-b-2 border-neutral-100 flex items-center gap-2">
                <HelpCircle className="w-4 h-4" />
                <span className="font-bold uppercase text-sm">{t('instructor.quizzes.form.quizName')}</span>
              </div>
              <div className="p-4 space-y-4">
                <Form.Item
                  label={t('instructor.quizzes.form.quizName')}
                  name="name"
                  rules={[{ required: true, message: t('instructor.quizzes.form.quizNameRequired') }]}
                  className="mb-0"
                >
                  <Input placeholder={t('instructor.quizzes.form.quizNamePlaceholder')} className="h-10" />
                </Form.Item>

                <div className="grid grid-cols-2 gap-4">
                  <Form.Item
                    label={t('instructor.quizzes.form.passScore')}
                    name="passScoreCriteria"
                    rules={[{ required: true, message: t('instructor.quizzes.validation.passScoreRequired') }]}
                    className="mb-0"
                  >
                    <InputNumber min={1} max={100} className="w-full h-10 pt-1" />
                  </Form.Item>

                  <Form.Item
                    label={t('instructor.quizzes.form.timeLimit')}
                    name="timelimitMinute"
                    rules={[{ required: true, message: t('instructor.quizzes.validation.timeLimitRequired') }]}
                    className="mb-0"
                  >
                    <InputNumber min={1} max={180} className="w-full h-10 pt-1" />
                  </Form.Item>
                </div>

                <Form.Item
                  label={t('instructor.quizzes.form.description')}
                  name="description"
                  className="mb-0"
                >
                  <Input.TextArea
                    rows={4}
                    placeholder={t('instructor.quizzes.form.descriptionPlaceholder')}
                    style={{ resize: 'none' }}
                  />
                </Form.Item>
              </div>
            </div>

            {/* Score Summary Sticky Card */}
            <div className="bg-black text-white border-2 border-black sticky top-6">
              <div className="p-4 border-b border-neutral-800">
                <h3 className="font-bold uppercase text-yellow-400 tracking-wider flex items-center gap-2">
                  <Star className="w-4 h-4" /> Score Summary
                </h3>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase font-bold text-neutral-400">{t('instructor.quizzes.totalQuestions')}</span>
                  <span className="text-2xl font-black text-white">{questions.length}</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase font-bold text-neutral-400">{t('instructor.quizzes.totalQuizScore')}</span>
                  <span className={`text-2xl font-black ${isScoreValid ? 'text-green-400' : 'text-red-500'}`}>{totalScore.toFixed(2)}</span>
                </div>
                <div className="w-full h-px bg-neutral-800 my-2" />
                <div className="flex justify-between items-end">
                  <span className="text-xs uppercase font-bold text-neutral-400">{t('instructor.quizzes.scoreSummary.remaining')}</span>
                  <span className={`text-2xl font-black ${isScoreValid ? 'text-green-400' : 'text-yellow-400'}`}>{remainingScore.toFixed(2)}</span>
                </div>

                {!isScoreValid && (
                  <div className="mt-4 p-2 bg-red-900/50 border border-red-500 text-red-200 text-xs font-medium flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {t('instructor.quizzes.scoreSummary.mustEqual10')}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Questions */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-black uppercase text-xl flex items-center gap-2">
                <List className="w-5 h-5" /> {t('instructor.quizzes.questions.title')}
              </h3>
              <button
                type="button"
                onClick={addQuestion}
                className="px-4 py-2 bg-yellow-400 border-2 border-black font-bold uppercase text-xs hover:bg-yellow-500 transition-colors flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]"
              >
                <Plus className="w-4 h-4" /> {t('instructor.quizzes.questions.addQuestion')}
              </button>
            </div>

            <div className="space-y-6">
              {questions.map((question, qIdx) => (
                <div key={question.id} className="bg-white border-2 border-black group transition-all hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)]">
                  <div className="h-1 bg-neutral-200 group-hover:bg-yellow-400 transition-colors" />
                  <div className="p-4 border-b-2 border-neutral-100 flex justify-between items-start bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 bg-black text-white flex items-center justify-center font-black rounded-none text-sm border-2 border-black group-hover:bg-yellow-400 group-hover:text-black transition-colors">{qIdx + 1}</span>
                      <div>
                        <h4 className="font-bold uppercase text-sm">{t('instructor.quizzes.questions.question')} {qIdx + 1}</h4>
                        <div className="flex gap-2 mt-1">
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 bg-neutral-200 border border-neutral-300">
                            {question.questionScore} pts
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeQuestion(qIdx)}
                      className="p-2 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-neutral-500">{t('instructor.quizzes.questions.questionText')} *</label>
                        <Input
                          value={question.name}
                          onChange={(e) => updateQuestion(qIdx, 'name', e.target.value)}
                          placeholder={t('instructor.quizzes.questions.enterQuestion')}
                          className="h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-neutral-500">{t('instructor.quizzes.questions.score')} *</label>
                        <InputNumber
                          className="w-full h-10 pt-1"
                          value={question.questionScore}
                          onChange={(value) => updateQuestion(qIdx, 'questionScore', value)}
                          min={0.1}
                          max={10}
                          step={0.1}
                          status={scoreErrors[qIdx] ? 'error' : ''}
                        />
                        {scoreErrors[qIdx] && <p className="text-xs text-red-500 mt-1 font-bold">{scoreErrors[qIdx]}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-neutral-500">{t('instructor.quizzes.questions.description')}</label>
                      <Input.TextArea
                        rows={1}
                        value={question.description}
                        onChange={(e) => updateQuestion(qIdx, 'description', e.target.value)}
                        placeholder={t('instructor.quizzes.questions.descriptionPlaceholder')}
                      />
                    </div>

                    <div className="bg-neutral-50 border-2 border-neutral-100 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-black uppercase tracking-wider flex items-center gap-2">
                          <Target className="w-3 h-3" /> {t('instructor.quizzes.answerOptions', { count: question.options.length })}
                        </span>
                        <button
                          type="button"
                          onClick={() => addOption(qIdx)}
                          className="text-xs font-bold uppercase text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> {t('instructor.quizzes.options.addOption')}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {question.options.map((option, oIdx) => {
                          const optionScore = getOptionScore(qIdx, option.isCorrect);
                          return (
                            <div key={option.id || oIdx} className={`p-3 bg-white border-2 transition-all group/opt ${option.isCorrect ? 'border-green-500 shadow-[4px_4px_0px_0px_#22c55e]' : 'border-neutral-200 hover:border-black'}`}>
                              <div className="flex gap-3 items-start">
                                <div className="mt-1">
                                  <Checkbox
                                    checked={option.isCorrect}
                                    onChange={(e) => updateOption(qIdx, oIdx, 'isCorrect', e.target.checked)}
                                  />
                                </div>
                                <div className="flex-1 space-y-2">
                                  <Input
                                    value={option.name}
                                    onChange={(e) => updateOption(qIdx, oIdx, 'name', e.target.value)}
                                    placeholder={`${t('instructor.quizzes.options.option')} ${oIdx + 1}`}
                                    className={`h-9 ${option.isCorrect ? 'border-green-200 focus:border-green-500' : ''}`}
                                  />
                                  <Input.TextArea
                                    rows={1}
                                    value={option.explanation}
                                    onChange={(e) => updateOption(qIdx, oIdx, 'explanation', e.target.value)}
                                    placeholder={t('instructor.quizzes.options.explanationPlaceholder')}
                                    className="text-xs"
                                  />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => removeOption(qIdx, oIdx)}
                                    className="w-6 h-6 flex items-center justify-center text-neutral-300 hover:text-red-500 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                  {option.isCorrect && (
                                    <span className="text-[10px] uppercase font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-none border border-green-200">
                                      +{optionScore.toFixed(1)} pts
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
                </div>
              ))}

              <button
                type="button"
                onClick={addQuestion}
                className="w-full py-4 border-2 border-dashed border-neutral-300 hover:border-yellow-400 hover:bg-yellow-50 text-neutral-400 hover:text-yellow-700 font-bold uppercase transition-all flex items-center justify-center gap-2 group"
              >
                <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {t('instructor.quizzes.questions.addQuestion')}
              </button>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
}

