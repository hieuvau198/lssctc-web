import React, { useState, useEffect } from 'react';
import {
  Drawer,
  Form,
  Input,
  Button,
  InputNumber,
  Checkbox,
  Divider,
  Card,
  Space,
  App,
} from 'antd';
import { Plus, Trash2, X, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { createQuizWithQuestions } from '../../../../apis/Instructor/InstructorQuiz';

const CreateQuizDrawer = ({ open, onClose, onSuccess }) => {
  const { t } = useTranslation();
  const { message, modal } = App.useApp();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [scoreErrors, setScoreErrors] = useState({});
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

  // Reset form when drawer opens
  useEffect(() => {
    if (open) {
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
      setScoreErrors({});
    }
  }, [open, form]);

  // Calculate total score
  const totalScore = questions.reduce((sum, q) => sum + (q.questionScore || 0), 0);
  const remainingScore = 10 - totalScore;
  const isScoreValid = Math.abs(totalScore - 10) < 0.01;

  // Validate question score
  const validateQuestionScore = (qIdx, score) => {
    if (!score || score <= 0) return null;
    const scoreStr = score.toString();
    const decimalPart = scoreStr.split('.')[1];
    if (decimalPart && decimalPart.length > 2) {
      return t('instructor.quizzes.scoreSummary.maxDecimalPlaces');
    }
    return null;
  };

  // Calculate option score
  const getOptionScore = (qIdx, isOptionCorrect) => {
    const q = questions[qIdx];
    if (!q.questionScore || !isOptionCorrect) return 0;
    return q.questionScore;
  };

  // Show error modal
  const showErrorModal = (title, errorMessage) => {
    modal.error({
      title,
      content: errorMessage,
      okText: t('instructor.quizzes.modal.close'),
      centered: true,
    });
  };

  // Add new question
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

  // Remove question
  const removeQuestion = (qIdx) => {
    if (questions.length === 1) {
      message.warning(t('instructor.quizzes.questions.atLeastOneQuestion'));
      return;
    }
    const newQuestions = questions.filter((_, idx) => idx !== qIdx);
    setQuestions(newQuestions);

    // Clean up score errors
    const newErrors = { ...scoreErrors };
    delete newErrors[qIdx];
    setScoreErrors(newErrors);
  };

  // Update question field
  const updateQuestion = (qIdx, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIdx][field] = value;

    if (field === 'questionScore') {
      const warning = validateQuestionScore(qIdx, value);
      setScoreErrors((prev) => ({ ...prev, [qIdx]: warning }));
    }

    setQuestions(newQuestions);
  };

  // Add option to question
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

  // Remove option from question
  const removeOption = (qIdx, oIdx) => {
    const newQuestions = [...questions];
    if (newQuestions[qIdx].options.length === 1) {
      message.warning(t('instructor.quizzes.options.atLeastOneOption'));
      return;
    }
    newQuestions[qIdx].options = newQuestions[qIdx].options.filter((_, idx) => idx !== oIdx);
    setQuestions(newQuestions);
  };

  // Update option field
  const updateOption = (qIdx, oIdx, field, value) => {
    const newQuestions = [...questions];

    // If marking as correct, uncheck others (single choice)
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

  // Handle form submit - Call API POST /api/Quizzes/with-questions
  const onFinish = async (values) => {
    try {
      // Validate questions
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

        // Check decimal places
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

        // Validate correct answers
        const correctAnswers = q.options.filter((opt) => opt.isCorrect).length;
        if (correctAnswers === 0) {
          showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.atLeastOneCorrect', { name: q.name }));
          return;
        }
        if (correctAnswers > 1) {
          showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.onlyOneCorrect', { name: q.name }));
          return;
        }

        // Validate option texts
        for (let opt of q.options) {
          if (!opt.name.trim()) {
            showErrorModal(t('instructor.quizzes.validation.title'), t('instructor.quizzes.validation.emptyOption', { name: q.name }));
            return;
          }
        }
      }

      // Validate total score
      if (!isScoreValid) {
        showErrorModal(
          t('instructor.quizzes.validation.title'),
          t('instructor.quizzes.validation.totalScoreMustEqual10', { score: totalScore.toFixed(2) })
        );
        return;
      }

      setSubmitting(true);

      // Build payload for POST /api/Quizzes/with-questions
      const payload = {
        name: values.name.trim(),
        description: values.description?.trim() || '',
        passScoreCriteria: values.passScoreCriteria,
        timelimitMinute: values.timelimitMinute,
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

      // Call API
      const response = await createQuizWithQuestions(payload);

      if (response?.status === 200 || response?.data) {
        message.success(response?.message || t('instructor.quizzes.messages.createSuccess'));
      } else {
        message.success(t('instructor.quizzes.messages.createSuccess'));
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
      title={t('instructor.quizzes.drawer.createTitle')}
      placement="right"
      width={720}
      open={open}
      onClose={onClose}
      destroyOnClose
      maskClosable={false}
      extra={
        <Space>
          <Button onClick={onClose} icon={<X className="w-4 h-4" />}>
            {t('instructor.quizzes.drawer.cancel')}
          </Button>
          <Button
            type="primary"
            loading={submitting}
            onClick={() => form.submit()}
            icon={<Save className="w-4 h-4" />}
          >
            {t('instructor.quizzes.drawer.create')}
          </Button>
        </Space>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          passScoreCriteria: 5,
          timelimitMinute: 20,
        }}
      >
        {/* Quiz Information */}
        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            label={t('instructor.quizzes.form.quizName')}
            name="name"
            rules={[{ required: true, message: t('instructor.quizzes.form.quizNameRequired') }]}
            className="col-span-2"
          >
            <Input placeholder={t('instructor.quizzes.form.quizNamePlaceholder')} />
          </Form.Item>

          <Form.Item
            label={t('instructor.quizzes.form.passScore')}
            name="passScoreCriteria"
            rules={[{ required: true, message: t('common.required') }]}
          >
            <InputNumber min={1} max={10} className="w-full" />
          </Form.Item>

          <Form.Item
            label={t('instructor.quizzes.form.timeLimit')}
            name="timelimitMinute"
            rules={[{ required: true, message: t('common.required') }]}
          >
            <InputNumber min={1} max={180} className="w-full" />
          </Form.Item>

          <Form.Item label={t('instructor.quizzes.form.description')} name="description" className="col-span-2">
            <Input.TextArea rows={2} placeholder={t('instructor.quizzes.form.descriptionPlaceholder')} />
          </Form.Item>
        </div>

        <Divider>{t('instructor.quizzes.questions.title')}</Divider>

        {/* Score Summary */}
        <div className="mb-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="grid grid-cols-4 gap-x-2 text-center">
            <div>
              <p className="text-xs text-gray-600">{t('instructor.quizzes.scoreSummary.questions')}</p>
              <p className="text-lg font-bold text-blue-600">{questions.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">{t('instructor.quizzes.scoreSummary.totalScore')}</p>
              <p className="text-lg font-bold text-green-600">{totalScore.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">{t('instructor.quizzes.scoreSummary.perQuestionAvg')}</p>
              <p className="text-lg font-bold text-purple-600">
                {questions.length > 0 ? (totalScore / questions.length).toFixed(2) : '0'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-600">{t('instructor.quizzes.scoreSummary.remaining')}</p>
              <p
                className="text-lg font-bold"
                style={{ color: isScoreValid ? '#22c55e' : '#ef4444' }}
              >
                {remainingScore.toFixed(2)}
              </p>
            </div>
          </div>
          <p className="text-xs text-gray-500 text-center">
            {t('instructor.quizzes.scoreSummary.mustEqual10')}
          </p>
        </div>

        {/* Questions List */}
        <div className="space-y-3">
          {questions.map((question, qIdx) => (
            <Card
              key={question.id}
              size="small"
              title={
                <span className="text-sm font-medium">
                  {t('instructor.quizzes.questions.question')} {qIdx + 1}
                  <span className="text-gray-400 font-normal ml-2">
                    ({question.questionScore || 0} {t('instructor.quizzes.questions.pts')})
                  </span>
                </span>
              }
              extra={
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<Trash2 className="w-4 h-4" />}
                  onClick={() => removeQuestion(qIdx)}
                />
              }
              className="bg-gray-50"
            >
              <div className="space-y-3">
                {/* Question text and score */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-medium mb-1">{t('instructor.quizzes.questions.questionText')} *</label>
                    <Input
                      value={question.name}
                      onChange={(e) => updateQuestion(qIdx, 'name', e.target.value)}
                      placeholder={t('instructor.quizzes.questions.enterQuestion')}
                      size="small"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">{t('instructor.quizzes.questions.score')} *</label>
                    <InputNumber
                      className="w-full"
                      value={question.questionScore}
                      onChange={(value) => updateQuestion(qIdx, 'questionScore', value)}
                      min={0.1}
                      max={10}
                      step={0.1}
                      size="small"
                      status={scoreErrors[qIdx] ? 'error' : ''}
                    />
                    {scoreErrors[qIdx] && (
                      <p className="text-xs text-red-600 mt-1">{scoreErrors[qIdx]}</p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-medium mb-1">{t('instructor.quizzes.questions.description')}</label>
                  <Input.TextArea
                    rows={1}
                    value={question.description}
                    onChange={(e) => updateQuestion(qIdx, 'description', e.target.value)}
                    placeholder={t('instructor.quizzes.questions.descriptionPlaceholder')}
                    size="small"
                  />
                </div>

                {/* Options */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-medium">{t('instructor.quizzes.options.title')}</label>
                    <Button
                      type="dashed"
                      size="small"
                      icon={<Plus className="w-3 h-3" />}
                      onClick={() => addOption(qIdx)}
                    >
                      {t('common.add')}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {question.options.map((option, oIdx) => {
                      const optionScore = getOptionScore(qIdx, option.isCorrect);
                      return (
                        <div
                          key={option.id}
                          className="p-2 bg-white border border-gray-200 rounded"
                        >
                          <div className="flex gap-2 items-center mb-1">
                            <Input
                              value={option.name}
                              onChange={(e) => updateOption(qIdx, oIdx, 'name', e.target.value)}
                              placeholder={`${t('instructor.quizzes.options.option')} ${oIdx + 1}`}
                              size="small"
                              className="flex-1"
                            />
                            <Button
                              type="text"
                              danger
                              size="small"
                              icon={<Trash2 className="w-3 h-3" />}
                              onClick={() => removeOption(qIdx, oIdx)}
                            />
                          </div>
                          <div className="flex justify-between items-center">
                            <Checkbox
                              checked={option.isCorrect}
                              onChange={(e) => updateOption(qIdx, oIdx, 'isCorrect', e.target.checked)}
                            >
                              <span className="text-xs">{t('instructor.quizzes.options.correctAnswer')}</span>
                            </Checkbox>
                            <span
                              className="text-xs px-2 py-0.5 rounded"
                              style={{
                                backgroundColor: option.isCorrect ? '#d4edda' : '#f8f9fa',
                                color: option.isCorrect ? '#155724' : '#6c757d',
                              }}
                            >
                              {optionScore.toFixed(1)} {t('instructor.quizzes.questions.pts')}
                            </span>
                          </div>
                          <Input.TextArea
                            rows={1}
                            value={option.explanation}
                            onChange={(e) => updateOption(qIdx, oIdx, 'explanation', e.target.value)}
                            placeholder={t('instructor.quizzes.options.explanationPlaceholder')}
                            size="small"
                            className="mt-1"
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

        {/* Add Question Button */}
        <Button
          type="dashed"
          block
          icon={<Plus className="w-4 h-4" />}
          onClick={addQuestion}
          className="mt-4"
        >
          {t('instructor.quizzes.questions.addQuestion')}
        </Button>
      </Form>
    </Drawer>
  );
};

export default CreateQuizDrawer;
