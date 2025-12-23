import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  InputNumber,
  Checkbox,
  App,
} from 'antd';
import { Plus, Trash2, X, Save, HelpCircle, FileText, Target, Star, List, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createQuizWithQuestions, updateQuizWithQuestions } from '../../../../apis/Instructor/InstructorQuiz';

const CreateQuizDrawer = ({ open, onClose, onSuccess, mode = 'create', initialData = null, quizId = null }) => {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [scoreErrors, setScoreErrors] = useState({});
  const [collapsedQuestions, setCollapsedQuestions] = useState({}); // New state for collapse
  const [questions, setQuestions] = useState([
    {
      id: 1,
      name: '',
      description: '',
      isMultipleAnswers: false,
      questionScore: 10,
      options: [{ id: 1, name: '', isCorrect: true, explanation: '' }],
    },
  ]);

  // Initialize form when drawer opens
  useEffect(() => {
    if (open) {
      setScoreErrors({});
      setCollapsedQuestions({});
      if (mode === 'edit' && initialData) {
        form.setFieldsValue({
          name: initialData.name,
          description: initialData.description,
          passScoreCriteria: initialData.passScoreCriteria,
          timelimitMinute: initialData.timelimitMinute,
          maxAttempts: initialData.maxAttempts || 1,
        });

        const mappedQuestions = (initialData.questions || []).map((q, qIdx) => ({
          id: q.id || qIdx + 1,
          name: q.name || '',
          description: q.description || '',
          isMultipleAnswers: q.isMultipleAnswers || false,
          questionScore: q.questionScore || 0,
          options: (q.options || []).map((o, oIdx) => ({
            id: o.id || oIdx + 1,
            name: o.name || '',
            isCorrect: !!o.isCorrect,
            explanation: o.explanation || '',
          })),
        }));

        setQuestions(mappedQuestions.length ? mappedQuestions : [
          {
            id: 1,
            name: '',
            description: '',
            isMultipleAnswers: false,
            questionScore: 10,
            options: [{ id: 1, name: '', isCorrect: true, explanation: '' }],
          }
        ]);
      } else {
        form.resetFields();
        setQuestions([
          {
            id: 1,
            name: '',
            description: '',
            isMultipleAnswers: false,
            questionScore: 10,
            options: [{ id: 1, name: '', isCorrect: true, explanation: '' }],
          },
        ]);
      }
    }
  }, [open, form, initialData, mode]);

  const totalScore = questions.reduce((sum, q) => sum + (q.questionScore || 0), 0);
  const remainingScore = 10 - totalScore;
  const isScoreValid = Math.abs(totalScore - 10) < 0.01;

  const validateQuestionScore = (qIdx, score) => {
    if (!score || score <= 0) return null;
    const scoreStr = score.toString();
    const decimalPart = scoreStr.split('.')[1];
    if (decimalPart && decimalPart.length > 2) {
      return t('instructor.quizzes.scoreSummary.maxDecimalPlaces');
    }
    return null;
  };

  const getOptionScore = (qIdx, isOptionCorrect) => {
    const q = questions[qIdx];
    if (!q.questionScore || !isOptionCorrect) return 0;
    return q.questionScore;
  };

  const showErrorModal = (title, errorMessage) => {
    modal.error({
      title,
      content: errorMessage,
      okText: t('instructor.quizzes.modal.close'),
      centered: true,
      okButtonProps: { className: 'bg-black text-white border-2 border-black hover:bg-neutral-800' }
    });
  };

  const toggleCollapse = (qId) => {
    setCollapsedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }));
  };

  const addQuestion = () => {
    const newId = Math.max(...questions.map((q) => q.id || 0)) + 1;
    setQuestions([
      ...questions,
      {
        id: newId,
        name: '',
        description: '',
        isMultipleAnswers: false,
        questionScore: 0,
        options: [{ id: 1, name: '', isCorrect: true, explanation: '' }],
      },
    ]);
  };

  const removeQuestion = (qIdx) => {
    if (questions.length === 1) {
      message.warning(t('instructor.quizzes.questions.atLeastOneQuestion'));
      return;
    }
    const qToRemove = questions[qIdx];
    const newQuestions = questions.filter((_, idx) => idx !== qIdx);
    setQuestions(newQuestions);

    const newErrors = { ...scoreErrors };
    delete newErrors[qIdx];
    setScoreErrors(newErrors);

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
      setScoreErrors((prev) => ({ ...prev, [qIdx]: warning }));
    }

    setQuestions(newQuestions);
  };

  const addOption = (qIdx) => {
    const newQuestions = [...questions];
    const newId = Math.max(...(newQuestions[qIdx].options || []).map((o) => o.id || 0)) + 1;
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
      message.warning(t('instructor.quizzes.options.atLeastOneOption'));
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
        isCorrect: idx === oIdx,
      }));
    } else {
      newQuestions[qIdx].options[oIdx][field] = value;
    }

    setQuestions(newQuestions);
  };

  const onFinish = async (values) => {
    try {
      if (!questions || questions.length === 0) {
        showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.atLeastOneQuestion'));
        return;
      }

      for (let q of questions) {
        if (!q.name.trim()) {
          showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.enterQuestionText'));
          return;
        }

        if (!q.questionScore || q.questionScore <= 0) {
          showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.scoreGreaterThanZero', { name: q.name }));
          return;
        }

        const scoreStr = q.questionScore.toString();
        const decimalPart = scoreStr.split('.')[1];
        if (decimalPart && decimalPart.length > 2) {
          showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.maxDecimalPlaces', { name: q.name }));
          return;
        }

        if (!q.options || q.options.length === 0) {
          showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.atLeastOneOption', { name: q.name }));
          return;
        }

        const correctAnswers = q.options.filter((opt) => opt.isCorrect).length;
        if (correctAnswers === 0) {
          showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.atLeastOneCorrect', { name: q.name }));
          return;
        }
        if (correctAnswers > 1) {
          showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.onlyOneCorrect', { name: q.name }));
          return;
        }

        for (let opt of q.options) {
          if (!opt.name.trim()) {
            showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.emptyOption', { name: q.name }));
            return;
          }
        }
      }

      if (!isScoreValid) {
        showErrorModal(
          t('instructor.quizzes.validation.title'),
          t('instructor.quizzes.validation.totalScoreMustEqual10', { score: totalScore.toFixed(2) })
        );
        return;
      }

      setSubmitting(true);

      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        passScoreCriteria: values.passScoreCriteria,
        timelimitMinute: values.timelimitMinute,
        maxAttempts: values.maxAttempts,
        questions: questions.map((q) => ({
          name: q.name.trim(),
          description: q.description?.trim() || '',
          isMultipleAnswers: false,
          questionScore: q.questionScore || 10,
          imageUrl: '',
          options: q.options.map((opt) => ({
            name: opt.name.trim(),
            description: '',
            isCorrect: opt.isCorrect || false,
            explanation: opt.explanation?.trim() || '',
          })),
        })),
      };

      let response;
      if (mode === 'edit' && quizId) {
        response = await updateQuizWithQuestions(quizId, payload);
        message.success(response?.message || t('instructor.quizzes.messages.updateQuizSuccess'));
      } else {
        response = await createQuizWithQuestions(payload);
        message.success(response?.message || t('instructor.quizzes.messages.createSuccess'));
      }

      onSuccess?.();
      onClose();
    } catch (e) {
      console.error('Error creating quiz:', e);
      let errorMsg = t('instructor.quizzes.messages.createFailed');
      if (e?.response?.data) {
        const data = e.response.data;
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
        } else if (data.message) {
          errorMsg = data.message;
        } else if (data.title) {
          errorMsg = data.title;
        }
      } else if (e?.message) {
        errorMsg = e.message;
      }
      showErrorModal(t('instructor.quizzes.modal.errorCreating'), errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Drawer
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-yellow-400 border-2 border-black flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-black" />
          </div>
          <span className="font-black text-black uppercase tracking-tight">
            {mode === 'edit' ? t('instructor.quizzes.drawer.editTitle') : t('instructor.quizzes.drawer.createTitle')}
          </span>
        </div>
      }
      placement="right"
      width={800}
      open={open}
      onClose={onClose}
      destroyOnClose
      maskClosable={false}
      styles={{
        header: {
          borderBottom: '2px solid #000',
          padding: '16px 24px',
        },
        body: {
          padding: 24,
          background: '#f5f5f5',
        },
      }}
      extra={
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black font-bold uppercase text-sm border-2 border-black hover:bg-neutral-100 transition-all"
          >
            <X className="w-4 h-4" />
            {t('instructor.quizzes.drawer.cancel')}
          </button>
          <button
            onClick={() => form.submit()}
            disabled={submitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-400 text-black font-bold uppercase text-sm border-2 border-black hover:bg-yellow-500 transition-all disabled:opacity-50"
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {mode === 'edit' ? t('instructor.quizzes.drawer.save') : t('instructor.quizzes.drawer.create')}
          </button>
        </div>
      }
    >

      <style>{`
          .industrial-form .ant-input, 
          .industrial-form .ant-input-number, 
          .industrial-form .ant-input-textarea {
            border: 2px solid #000 !important;
            border-radius: 0 !important;
            font-weight: 500;
          }
          .industrial-form .ant-input:focus, 
          .industrial-form .ant-input-number-focused,
          .industrial-form .ant-input-textarea:focus,
          .industrial-form .ant-input:hover,
          .industrial-form .ant-input-number:hover {
            border-color: #000 !important;
            box-shadow: 4px 4px 0 0 #facc15 !important;
          }
          .industrial-form .ant-input-number-handler-wrap {
            border-radius: 0 !important;
            border-left: 2px solid #000 !important;
            background: #000 !important;
          }
          .industrial-form .ant-input-number-handler {
             border-bottom: 1px solid #fff !important;
             color: #fff !important;
          }
          .industrial-form .ant-input-number-handler:hover {
             background: #333 !important;
             height: 50% !important;
          }
          .industrial-checkbox .ant-checkbox-inner {
            border: 2px solid #000 !important;
            border-radius: 0 !important;
          }
          .industrial-checkbox .ant-checkbox-checked .ant-checkbox-inner {
            background-color: #000 !important;
            border-color: #000 !important;
          }
          .industrial-form .ant-form-item-label label {
            color: #000 !important;
          }
        `}</style>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className="industrial-form"
        initialValues={{
          passScoreCriteria: 5,
          timelimitMinute: 20,
          maxAttempts: 1,
        }}
      >
        {/* Quiz Information Card */}
        <div className="bg-white border-2 border-black mb-6">
          <div className="h-1 bg-yellow-400" />
          <div className="px-4 py-3 border-b-2 border-black bg-neutral-50">
            <span className="font-bold uppercase text-sm tracking-wider">Quiz Information</span>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <Form.Item
                label={<span className="font-bold uppercase text-xs tracking-wider">{t('instructor.quizzes.form.quizName')}</span>}
                name="name"
                rules={[{ required: true, message: t('instructor.quizzes.form.quizNameRequired') }]}
                className="col-span-1"
              >
                <Input placeholder={t('instructor.quizzes.form.quizNamePlaceholder')} className="border-2 border-black h-10" />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold uppercase text-xs tracking-wider">{t('instructor.quizzes.scoreSummary.totalScore')}</span>}
                className="col-span-1"
              >
                <div className="h-10 bg-neutral-100 border-2 border-black flex items-center px-3 font-bold text-black">
                  {totalScore.toFixed(2)}
                </div>
              </Form.Item>

              <Form.Item
                label={<span className="font-bold uppercase text-xs tracking-wider">{t('instructor.quizzes.form.passScore')}</span>}
                name="passScoreCriteria"
                rules={[{ required: true, message: t('common.required') }]}
              >
                <InputNumber min={1} max={10} className="w-full h-10 border-2 border-black" />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold uppercase text-xs tracking-wider">{t('instructor.quizzes.form.timeLimit')}</span>}
                name="timelimitMinute"
                rules={[{ required: true, message: t('common.required') }]}
              >
                <InputNumber min={1} max={180} className="w-full h-10 border-2 border-black" />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold uppercase text-xs tracking-wider">{t('instructor.quizzes.form.maxAttempts', 'Max Attempts')}</span>}
                name="maxAttempts"
                rules={[{ required: true, message: t('common.required') }]}
              >
                <InputNumber min={1} max={100} className="w-full h-10 border-2 border-black" />
              </Form.Item>

              <Form.Item
                label={<span className="font-bold uppercase text-xs tracking-wider">{t('instructor.quizzes.form.description')}</span>}
                name="description"
                className="col-span-2"
              >
                <Input.TextArea rows={2} placeholder={t('instructor.quizzes.form.descriptionPlaceholder')} className="border-2 border-black" />
              </Form.Item>
            </div>
          </div>
        </div>

        {/* Score Summary Card - Industrial Theme */}
        <div className="bg-white border-2 border-black mb-6">
          <div className="h-1 bg-yellow-400" />
          <div className="px-4 py-3 border-b-2 border-black bg-neutral-50">
            <span className="font-bold uppercase text-sm tracking-wider">{t('instructor.quizzes.questions.title')}</span>
          </div>
          <div className="p-4">
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-3 mb-4">
              <div className="border-2 border-black p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-neutral-500">{t('instructor.quizzes.scoreSummary.questions')}</span>
                  <div className="w-8 h-8 bg-yellow-400 border border-black flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-black">{questions.length}</p>
              </div>
              <div className="border-2 border-black p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-neutral-500">{t('instructor.quizzes.scoreSummary.totalScore')}</span>
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <Star className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
                <p className={`text-2xl font-black ${isScoreValid ? 'text-black' : 'text-neutral-400'}`}>{totalScore.toFixed(2)}</p>
              </div>
              <div className="border-2 border-black p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-neutral-500">{t('instructor.quizzes.scoreSummary.perQuestionAvg')}</span>
                  <div className="w-8 h-8 bg-yellow-400 border border-black flex items-center justify-center">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-black">
                  {questions.length > 0 ? (totalScore / questions.length).toFixed(2) : '0'}
                </p>
              </div>
              <div className="border-2 border-black p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase text-neutral-500">{t('instructor.quizzes.scoreSummary.remainingScore')}</span>
                  <div className="w-8 h-8 bg-black flex items-center justify-center">
                    <List className="w-4 h-4 text-yellow-400" />
                  </div>
                </div>
                <p className={`text-2xl font-black ${isScoreValid ? 'text-black' : 'text-neutral-400'}`}>
                  {remainingScore.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Status Message */}
            <div className={`p-3 text-center text-sm font-bold uppercase border-2 ${isScoreValid
              ? 'bg-black text-white border-black'
              : 'bg-yellow-400 text-black border-black'
              }`}>
              {isScoreValid ? (
                <span>✓ {t('instructor.quizzes.scoreSummary.mustEqual10')}</span>
              ) : (
                <span>! {t('instructor.quizzes.scoreSummary.mustEqual10Info')}</span>
              )}
            </div>
          </div>
        </div>

        {/* Questions List - Industrial Theme */}
        <div className="space-y-4">
          {questions.map((question, qIdx) => {
            const isCollapsed = collapsedQuestions[question.id];

            return (
              <div key={question.id} className="bg-white border-2 border-black">
                <div className="h-1 bg-yellow-400" />

                {/* Question Header */}
                <div className="px-4 py-3 border-b-2 border-black bg-neutral-50 flex items-center justify-between">
                  <div className="flex items-center gap-3 select-none cursor-pointer" onClick={() => toggleCollapse(question.id)}>
                    <div className="text-neutral-500 hover:text-black transition-colors">
                      {isCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
                    </div>

                    <span className="w-8 h-8 bg-black text-yellow-400 flex items-center justify-center font-black text-sm">
                      {qIdx + 1}
                    </span>
                    <span className="font-bold uppercase text-sm flex items-center gap-2">
                      {t('instructor.quizzes.questions.question')} {qIdx + 1}
                      {isCollapsed && question.name && (
                        <span className="text-neutral-400 font-medium normal-case text-xs truncate max-w-[150px]">
                          — {question.name}
                        </span>
                      )}
                    </span>
                    <span className="px-3 py-1 bg-yellow-400 text-black text-xs font-bold border border-black">
                      {question.questionScore || 0} {t('instructor.quizzes.questions.pts')}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeQuestion(qIdx)}
                    className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center hover:bg-neutral-800 transition-colors text-white"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Content - Collapsible */}
                {!isCollapsed && (
                  <div className="p-4 space-y-4">
                    {/* Question text and score */}
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-black">{t('instructor.quizzes.questions.questionText')} *</label>
                        <Input
                          value={question.name}
                          onChange={(e) => updateQuestion(qIdx, 'name', e.target.value)}
                          placeholder={t('instructor.quizzes.questions.enterQuestion')}
                          className="border-2 border-black h-10"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-black">{t('instructor.quizzes.questions.score')} *</label>
                        <InputNumber
                          className="w-full h-10 border-2 border-black"
                          value={question.questionScore}
                          onChange={(value) => updateQuestion(qIdx, 'questionScore', value)}
                          min={0.1}
                          max={10}
                          step={0.1}
                          status={scoreErrors[qIdx] ? 'error' : ''}
                        />
                        {scoreErrors[qIdx] && (
                          <p className="text-xs text-black bg-yellow-400 p-1 mt-1 border border-black font-bold">{scoreErrors[qIdx]}</p>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1 text-black">{t('instructor.quizzes.questions.description')}</label>
                      <Input.TextArea
                        rows={1}
                        value={question.description}
                        onChange={(e) => updateQuestion(qIdx, 'description', e.target.value)}
                        placeholder={t('instructor.quizzes.questions.descriptionPlaceholder')}
                        className="border-2 border-black"
                      />
                    </div>

                    {/* Options */}
                    <div>
                      <div className="flex justify-between items-center mb-3">
                        <label className="text-xs font-bold uppercase tracking-wider text-black">{t('instructor.quizzes.options.title')}</label>
                        <button
                          type="button"
                          onClick={() => addOption(qIdx)}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-white text-black font-bold text-xs uppercase border-2 border-black hover:bg-neutral-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                          {t('common.add')}
                        </button>
                      </div>

                      <div className="space-y-3">
                        {question.options.map((option, oIdx) => {
                          const optionScore = getOptionScore(qIdx, option.isCorrect);
                          return (
                            <div
                              key={option.id}
                              className={`p-3 border-2 transition-all ${option.isCorrect
                                ? 'bg-white border-black shadow-[4px_4px_0px_0px_#000]'
                                : 'bg-white border-neutral-300 hover:border-black'
                                }`}
                            >
                              <div className="flex gap-2 items-center mb-2">
                                <span className={`flex-shrink-0 w-7 h-7 flex items-center justify-center text-xs font-black ${option.isCorrect ? 'bg-black text-white' : 'bg-neutral-200 text-black'
                                  }`}>
                                  {String.fromCharCode(65 + oIdx)}
                                </span>
                                <Input
                                  value={option.name}
                                  onChange={(e) => updateOption(qIdx, oIdx, 'name', e.target.value)}
                                  placeholder={`${t('instructor.quizzes.options.option')} ${oIdx + 1}`}
                                  className="flex-1 border-2 border-neutral-300 focus:border-black h-9"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeOption(qIdx, oIdx)}
                                  className="w-8 h-8 bg-black border-2 border-black flex items-center justify-center hover:bg-neutral-800 transition-colors text-white"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                              <div className="flex justify-between items-center mb-2">
                                <Checkbox
                                  checked={option.isCorrect}
                                  onChange={(e) => updateOption(qIdx, oIdx, 'isCorrect', e.target.checked)}
                                  className="font-medium industrial-checkbox"
                                >
                                  <span className="text-xs font-bold uppercase text-black">{option.isCorrect ? '✓ ' : ''}{t('instructor.quizzes.options.correctAnswer')}</span>
                                </Checkbox>
                                <span className={`text-xs px-3 py-1 font-bold border ${option.isCorrect ? 'bg-yellow-400 text-black border-black' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                                  {optionScore.toFixed(1)} {t('instructor.quizzes.questions.pts')}
                                </span>
                              </div>
                              <Input.TextArea
                                rows={1}
                                value={option.explanation}
                                onChange={(e) => updateOption(qIdx, oIdx, 'explanation', e.target.value)}
                                placeholder={t('instructor.quizzes.options.explanationPlaceholder')}
                                className="border-2 border-neutral-300 focus:border-black"
                              />
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
        </div>
          <div className=''>

        <button
          type="button"
          onClick={addQuestion}
          className="w-full py-3 border-2 border-dashed border-black bg-white text-black font-bold uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          {t('instructor.quizzes.questions.addQuestion')}
        </button>
          </div>
        {/* Add Question Button */}
      </Form>
    </Drawer>
  );
};

export default CreateQuizDrawer;