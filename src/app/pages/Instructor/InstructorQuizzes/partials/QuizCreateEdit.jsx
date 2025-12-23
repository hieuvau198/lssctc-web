import React, { useEffect, useState } from 'react';
import {
  Form,
  Input,
  InputNumber,
  Checkbox,
  Skeleton,
  App,
} from 'antd';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Save, 
  FileText, 
  Target, 
  Star, 
  List, 
  HelpCircle, 
  AlertCircle, 
  Check, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Award
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { createQuizWithQuestions, updateQuizWithQuestions, getQuizDetail } from '../../../../apis/Instructor/InstructorQuiz';

export default function QuizCreateEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { modal, message } = App.useApp();
  const { t } = useTranslation();
  const [form] = Form.useForm();
  
  const [loading, setLoading] = useState(!!id);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [scoreErrors, setScoreErrors] = useState({});
  const [collapsedQuestions, setCollapsedQuestions] = useState({});
  
  const [questions, setQuestions] = useState([
    { id: Date.now(), name: '', description: '', isMultipleAnswers: false, questionScore: 10, options: [{ id: Date.now() + 1, name: '', isCorrect: true, explanation: '' }] },
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

      form.setFieldsValue({
        name: data.name,
        description: data.description,
        passScoreCriteria: data.passScoreCriteria,
        timelimitMinute: data.timelimitMinute,
        totalScore: data.totalScore,
        maxAttempts: data.maxAttempts || 1,
      });

      if (data.questions && data.questions.length > 0) {
        const mappedQuestions = data.questions.map((q, qIdx) => ({
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
        }));
        
        setQuestions(mappedQuestions);

        // DEFAULT HIDE: Collapse all loaded questions
        const initialCollapseState = {};
        mappedQuestions.forEach(q => {
          initialCollapseState[q.id] = true;
        });
        setCollapsedQuestions(initialCollapseState);
      }
    } catch (e) {
      console.error('Error loading quiz:', e);
      setError(e?.message || t('instructor.quizzes.messages.loadQuizFailed'));
    } finally {
      setLoading(false);
    }
  };

  const toggleCollapse = (qId) => {
    setCollapsedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const getOptionScore = (qIdx, isOptionCorrect) => {
    const q = questions[qIdx];
    if (!q.questionScore || !isOptionCorrect) return 0;
    return q.questionScore;
  };

  const validateQuestionScore = (qIdx, score) => {
    if (!score || score <= 0) return null;
    const scoreStr = score.toString();
    const decimalPart = scoreStr.split('.')[1];
    if (decimalPart && decimalPart.length > 2) {
      return t('instructor.quizzes.validation.scoreTooManyDecimals', { score });
    }
    return null;
  };

  const onFinish = async (values) => {
    // Validation Logic (Same as before)
    try {
      setError(null);
      if (!questions || questions.length === 0) {
        message.error(t('instructor.quizzes.validation.addAtLeastOneQuestion'));
        return;
      }

      // ... (Existing validation loops for questions/options) ...
      // Keeping validation strict for data integrity
      for (let q of questions) {
        if (!q.name.trim()) {
            message.error(t('instructor.quizzes.validation.fillAllQuestionTexts'));
            return;
        }
        if (!q.questionScore || q.questionScore <= 0) {
             message.error(t('instructor.quizzes.validation.questionMustHaveScore', { name: q.name }));
             return;
        }
        const scoreStr = q.questionScore.toString();
        const decimalPart = scoreStr.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
             message.error(t('instructor.quizzes.validation.questionScoreMaxDecimals', { name: q.name }));
             return;
        }
        if (!q.options || q.options.length === 0) {
             message.error(t('instructor.quizzes.validation.questionMustHaveOption', { name: q.name }));
             return;
        }
        const correctAnswers = q.options.filter(opt => opt.isCorrect).length;
        if (correctAnswers === 0) {
             message.error(t('instructor.quizzes.validation.questionMustHaveCorrectAnswer', { name: q.name }));
             return;
        }
        if (correctAnswers > 1) {
             message.error(t('instructor.quizzes.validation.questionOnlyOneCorrectAnswer', { name: q.name }));
             return;
        }
        for (let opt of q.options) {
          if (!opt.name.trim()) {
            message.error(t('instructor.quizzes.validation.questionHasEmptyOption', { name: q.name }));
            return;
          }
        }
      }

      const totalScore = questions.reduce((sum, q) => sum + (q.questionScore || 0), 0);
      if (Math.abs(totalScore - 10) > 0.01) {
        message.error(t('instructor.quizzes.validation.totalScoreMustEqual10', { total: totalScore.toFixed(2) }));
        return;
      }

      setSubmitting(true);

      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        passScoreCriteria: values.passScoreCriteria,
        timelimitMinute: values.timelimitMinute,
        maxAttempts: values.maxAttempts,
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

      const response = isEditMode
        ? await updateQuizWithQuestions(id, payload)
        : await createQuizWithQuestions(payload);

      modal.success({
        title: t('common.success'),
        content: response?.message || (isEditMode ? t('instructor.quizzes.messages.updateQuizSuccess') : t('instructor.quizzes.messages.createQuizSuccess')),
        okText: t('common.ok'),
        centered: true,
        onOk: () => navigate('/instructor/quizzes')
      });
    } catch (e) {
      console.error('Error saving quiz:', e);
      let errorMsg = e?.response?.data?.message || e?.message || t('instructor.quizzes.messages.saveQuizFailed');
      if (e?.response?.data?.errors) {
         // handle validation errors map
         const errs = Object.values(e.response.data.errors).flat();
         if(errs.length > 0) errorMsg = errs[0];
      }
      modal.error({
          title: t('instructor.quizzes.modal.errorCreating'),
          content: errorMsg,
          centered: true
      });
    } finally {
      setSubmitting(false);
    }
  };

  const addQuestion = () => {
    const newId = Date.now();
    setQuestions([
      ...questions,
      {
        id: newId,
        name: '',
        description: '',
        isMultipleAnswers: false,
        questionScore: 10,
        options: [{ id: Date.now() + 1, name: '', isCorrect: true, explanation: '' }],
      },
    ]);
    // Note: We do NOT set collapsedQuestions[newId] = true, so it defaults to expanded (undefined/false)
  };

  const removeQuestion = (qIdx) => {
    if (questions.length === 1) {
      message.warning(t('instructor.quizzes.validation.mustHaveAtLeastOneQuestion'));
      return;
    }
    const qToRemove = questions[qIdx];
    setQuestions(questions.filter((_, idx) => idx !== qIdx));
    if (qToRemove.id) {
      const newCollapsed = { ...collapsedQuestions };
      delete newCollapsed[qToRemove.id];
      setCollapsedQuestions(newCollapsed);
    }
  };

  const updateQuestion = (qIdx, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx][field] = value;
    if (field === 'questionScore') {
      const warning = validateQuestionScore(qIdx, value);
      setScoreErrors(prev => ({ ...prev, [qIdx]: warning }));
    }
    setQuestions(newQuestions);
  };

  const addOption = (qIdx) => {
    const newQuestions = [...questions];
    newQuestions[qIdx].options.push({
      id: Date.now(),
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
    setQuestions(newQuestions);
  };

  const updateOption = (qIdx, oIdx, field, value) => {
    const newQuestions = [...questions];
    if (field === 'isCorrect' && value === true) {
      newQuestions[qIdx].options = newQuestions[qIdx].options.map((opt, idx) => ({
        ...opt,
        isCorrect: idx === oIdx
      }));
    } else {
      newQuestions[qIdx].options[oIdx][field] = value;
    }
    setQuestions(newQuestions);
  };

  const totalScore = questions.reduce((sum, q) => sum + (q.questionScore || 0), 0);
  const remainingScore = 10 - totalScore;
  const isScoreValid = Math.abs(totalScore - 10) < 0.01;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50">
        <div className="flex gap-4 mb-8">
            <Skeleton.Button active shape="square" />
            <Skeleton.Input active size="large" block />
        </div>
        <Skeleton active paragraph={{ rows: 10 }} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
           <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
           <h3 className="text-xl font-medium text-gray-900 mb-4">{t('common.error')}</h3>
           <p className="text-gray-600 mb-6">{error}</p>
           <button onClick={() => navigate('/instructor/quizzes')} className="text-indigo-600 hover:underline">
             {t('instructor.quizzes.backToQuizzes')}
           </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Custom Global Styles for Antd Inputs to match the soft gray theme */}
      <style>{`
          .clean-form .ant-input, 
          .clean-form .ant-input-number, 
          .clean-form .ant-input-textarea {
            border-radius: 0.5rem; /* rounded-lg */
            border-color: #e5e7eb; /* gray-200 */
            background-color: #ffffff;
            padding: 8px 12px;
          }
          .clean-form .ant-input:focus, 
          .clean-form .ant-input-number-focused,
          .clean-form .ant-input-textarea:focus {
            border-color: #9ca3af; /* gray-400 */
            box-shadow: 0 0 0 2px rgba(156, 163, 175, 0.2);
          }
          .clean-form .ant-form-item-label label {
            color: #4b5563; /* gray-600 */
            font-weight: 500;
          }
          .clean-checkbox .ant-checkbox-inner {
            border-radius: 0.25rem;
            border-color: #9ca3af;
          }
          .clean-checkbox .ant-checkbox-checked .ant-checkbox-inner {
            background-color: #4b5563; /* gray-600 */
            border-color: #4b5563;
          }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/instructor/quizzes')}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {isEditMode ? t('instructor.quizzes.editQuiz') : t('instructor.quizzes.createNewQuiz')}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {t('instructor.quizzes.form.descriptionPlaceholder')}
              </p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/instructor/quizzes')}
              className="px-5 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              onClick={() => form.submit()}
              disabled={submitting}
              className="px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 transition-all shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
              {isEditMode ? t('instructor.quizzes.updateQuiz') : t('instructor.quizzes.createQuiz')}
            </button>
          </div>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="clean-form"
          initialValues={{
            passScoreCriteria: 5,
            timelimitMinute: 20,
            maxAttempts: 1,
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column: Quiz Configuration */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* Basic Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">{t('instructor.quizzes.form.quizName')}</span>
                </div>
                <div className="p-6 space-y-5">
                  <Form.Item
                    label={t('instructor.quizzes.form.quizName')}
                    name="name"
                    rules={[{ required: true, message: t('instructor.quizzes.form.quizNameRequired') }]}
                    className="mb-0"
                  >
                    <Input placeholder="e.g., Introduction to Safety" />
                  </Form.Item>

                  <Form.Item
                    label={t('instructor.quizzes.form.description')}
                    name="description"
                    className="mb-0"
                  >
                    <Input.TextArea
                      rows={4}
                      placeholder="Briefly describe what this quiz covers..."
                      style={{ resize: 'none' }}
                    />
                  </Form.Item>
                </div>
              </div>

              {/* Settings Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-2">
                  <Target className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-700">Settings & Constraints</span>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <Form.Item
                      label={t('instructor.quizzes.form.passScore')}
                      name="passScoreCriteria"
                      rules={[{ required: true }]}
                      className="mb-0"
                    >
                      <InputNumber min={1} max={10} className="w-full" prefix={<Award className="w-3 h-3 text-gray-400 mr-1" />} />
                    </Form.Item>

                    <Form.Item
                      label={t('instructor.quizzes.form.timeLimit')}
                      name="timelimitMinute"
                      rules={[{ required: true }]}
                      className="mb-0"
                    >
                      <InputNumber min={1} max={180} className="w-full" prefix={<Clock className="w-3 h-3 text-gray-400 mr-1" />} />
                    </Form.Item>
                  </div>
                  
                  <Form.Item
                    label={t('instructor.quizzes.form.maxAttempts', 'Max Attempts')}
                    name="maxAttempts"
                    rules={[{ required: true }]}
                    className="mb-0"
                  >
                    <InputNumber min={1} max={100} className="w-full" />
                  </Form.Item>
                </div>
              </div>

              {/* Score Sticky Card */}
              <div className="sticky top-6">
                <div className="bg-gray-900 rounded-xl shadow-lg border border-gray-800 text-white overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-700">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" /> Score Summary
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{t('instructor.quizzes.totalQuestions')}</span>
                      <span className="text-xl font-bold">{questions.length}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{t('instructor.quizzes.totalQuizScore')}</span>
                      <span className={`text-xl font-bold ${isScoreValid ? 'text-green-400' : 'text-red-400'}`}>
                        {totalScore.toFixed(2)} / 10
                      </span>
                    </div>
                    
                    <div className="h-px bg-gray-700 my-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400">{t('instructor.quizzes.scoreSummary.remaining')}</span>
                      <span className={`text-xl font-bold ${isScoreValid ? 'text-gray-200' : 'text-yellow-400'}`}>
                        {remainingScore.toFixed(2)}
                      </span>
                    </div>

                    {!isScoreValid && (
                      <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-200 text-xs flex gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        {t('instructor.quizzes.scoreSummary.mustEqual10')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Questions */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <List className="w-5 h-5 text-gray-500" /> {t('instructor.quizzes.questions.title')}
                </h3>
                <button
                  type="button"
                  onClick={addQuestion}
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Plus className="w-4 h-4" /> {t('instructor.quizzes.questions.addQuestion')}
                </button>
              </div>

              <div className="space-y-4">
                {questions.map((question, qIdx) => {
                  const isCollapsed = collapsedQuestions[question.id];
                  
                  return (
                    <div key={question.id} className="bg-white rounded-xl border border-gray-200 shadow-sm transition-all hover:border-gray-300">
                      {/* Question Header */}
                      <div 
                        className={`px-6 py-4 flex justify-between items-center cursor-pointer select-none ${!isCollapsed ? 'border-b border-gray-100' : ''}`}
                        onClick={() => toggleCollapse(question.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-700 font-bold text-sm">
                            {qIdx + 1}
                          </div>
                          <div className="flex flex-col">
                             <div className="flex items-center gap-3">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {t('instructor.quizzes.questions.question')} {qIdx + 1}
                                </span>
                                {isCollapsed && (
                                  <span className="text-gray-400 text-sm font-normal truncate max-w-[200px]">
                                     {question.name ? `— ${question.name}` : ''}
                                  </span>
                                )}
                             </div>
                             <span className="text-xs font-medium text-gray-500 mt-0.5">
                                {question.questionScore} pts
                             </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeQuestion(qIdx); }}
                              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            <div className="w-px h-4 bg-gray-200 mx-1" />
                            <div className="text-gray-400">
                                {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                            </div>
                        </div>
                      </div>

                      {/* Expandable Content */}
                      {!isCollapsed && (
                        <div className="p-6 space-y-6 bg-white rounded-b-xl">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="md:col-span-3">
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('instructor.quizzes.questions.questionText')} <span className="text-red-500">*</span></label>
                              <Input
                                value={question.name}
                                onChange={(e) => updateQuestion(qIdx, 'name', e.target.value)}
                                placeholder="Enter your question here..."
                                className="w-full"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('instructor.quizzes.questions.score')} <span className="text-red-500">*</span></label>
                              <InputNumber
                                className="w-full"
                                value={question.questionScore}
                                onChange={(value) => updateQuestion(qIdx, 'questionScore', value)}
                                min={0.1}
                                max={10}
                                step={0.1}
                                status={scoreErrors[qIdx] ? 'error' : ''}
                              />
                              {scoreErrors[qIdx] && <p className="text-xs text-red-500 mt-1">{scoreErrors[qIdx]}</p>}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t('instructor.quizzes.questions.description')} <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <Input.TextArea
                              rows={2}
                              value={question.description}
                              onChange={(e) => updateQuestion(qIdx, 'description', e.target.value)}
                              placeholder="Add more context or instructions for this question..."
                              className="text-sm"
                            />
                          </div>

                          {/* Options Section */}
                          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5">
                            <div className="flex justify-between items-center mb-4">
                              <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <Check className="w-4 h-4 text-gray-400" /> Answer Options
                              </span>
                              <button
                                type="button"
                                onClick={() => addOption(qIdx)}
                                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" /> Add Option
                              </button>
                            </div>

                            <div className="space-y-3">
                              {question.options.map((option, oIdx) => {
                                const optionScore = getOptionScore(qIdx, option.isCorrect);
                                return (
                                  <div key={option.id || oIdx} className={`p-3 rounded-lg border transition-all bg-white group ${option.isCorrect ? 'border-gray-400 ring-1 ring-gray-200' : 'border-gray-200 hover:border-gray-300'}`}>
                                    <div className="flex gap-3 items-start">
                                      <div className="mt-2">
                                        <Checkbox
                                          className="clean-checkbox"
                                          checked={option.isCorrect}
                                          onChange={(e) => updateOption(qIdx, oIdx, 'isCorrect', e.target.checked)}
                                        />
                                      </div>
                                      <div className="flex-1 space-y-2">
                                        <Input
                                          value={option.name}
                                          onChange={(e) => updateOption(qIdx, oIdx, 'name', e.target.value)}
                                          placeholder={`Option ${oIdx + 1}`}
                                          className={`border-gray-200 ${option.isCorrect ? 'font-medium text-gray-900' : 'text-gray-600'}`}
                                        />
                                        <Input
                                          value={option.explanation}
                                          onChange={(e) => updateOption(qIdx, oIdx, 'explanation', e.target.value)}
                                          placeholder="Explanation (shown after submission)..."
                                          className="text-xs bg-gray-50 border-transparent focus:bg-white focus:border-gray-200"
                                        />
                                      </div>
                                      <div className="flex flex-col items-end gap-2">
                                        <button
                                          type="button"
                                          onClick={() => removeOption(qIdx, oIdx)}
                                          className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                        {option.isCorrect && (
                                          <span className="text-[10px] font-bold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">
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
                      )}
                    </div>
                  );
                })}

                <button
                  type="button"
                  onClick={addQuestion}
                  className="w-full py-4 rounded-xl border-2 border-dashed border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-white font-medium transition-all flex items-center justify-center gap-2 group"
                >
                  <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <span>Add New Question</span>
                </button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}