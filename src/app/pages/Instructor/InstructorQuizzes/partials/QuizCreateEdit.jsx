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
          {t('instructor.quizzes.backToQuizzes')}
        </Button>
        <Alert type="error" message={t('common.error')} description={error} />
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
        {t('instructor.quizzes.backToQuizzes')}
      </Button>

      {error && (
        <Alert 
          type="error" 
          message={t('common.error')} 
          description={error}
          closable
          onClose={() => setError(null)}
          className="mb-4"
        />
      )}

      <Card title={isEditMode ? t('instructor.quizzes.editQuiz') : t('instructor.quizzes.createNewQuiz')}>
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
              label={t('instructor.quizzes.form.quizName')}
              name="name"
              rules={[{ required: true, message: t('instructor.quizzes.form.quizNameRequired') }]}
            >
              <Input placeholder={t('instructor.quizzes.form.quizNamePlaceholder')} />
            </Form.Item>

            <Form.Item
              label={t('instructor.quizzes.scoreSummary.totalScore')}
            >
              <Input 
                value="10" 
                disabled 
                placeholder={t('instructor.quizzes.fixedAt10Points')}
              />
            </Form.Item>

            <Form.Item
              label={t('instructor.quizzes.form.passScore')}
              name="passScoreCriteria"
              rules={[{ required: true, message: t('instructor.quizzes.validation.passScoreRequired') }]}
            >
              <InputNumber min={1} max={100} />
            </Form.Item>

            <Form.Item
              label={t('instructor.quizzes.form.timeLimit')}
              name="timelimitMinute"
              rules={[{ required: true, message: t('instructor.quizzes.validation.timeLimitRequired') }]}
            >
              <InputNumber min={1} max={180} />
            </Form.Item>
          </div>

          <Form.Item
            label={t('instructor.quizzes.form.description')}
            name="description"
          >
            <Input.TextArea 
              rows={3}
              placeholder={t('instructor.quizzes.form.descriptionPlaceholder')}
            />
          </Form.Item>

          <Divider>{t('instructor.quizzes.questions.title')}</Divider>

          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">{t('instructor.quizzes.totalQuestions')}</p>
                <p className="text-2xl font-bold text-blue-600">{questions.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">{t('instructor.quizzes.totalQuizScore')}</p>
                <p className="text-2xl font-bold text-green-600">
                  {questions.reduce((sum, q) => sum + (q.questionScore || 0), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">{t('instructor.quizzes.scoreSummary.perQuestionAvg')}</p>
                <p className="text-2xl font-bold text-purple-600">
                  {questions.length > 0 ? (questions.reduce((sum, q) => sum + (q.questionScore || 0), 0) / questions.length).toFixed(2) : '0'}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">{t('instructor.quizzes.scoreSummary.remaining')}</p>
                <p className="text-2xl font-bold" style={{
                  color: Math.abs(questions.reduce((sum, q) => sum + (q.questionScore || 0), 0) - 10) < 0.01 ? '#22c55e' : '#ef4444'
                }}>
                  {(10 - questions.reduce((sum, q) => sum + (q.questionScore || 0), 0)).toFixed(2)}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              ℹ️ {t('instructor.quizzes.scoreSummary.mustEqual10')}
            </p>
          </div>

          <div className="space-y-4">
            {questions.map((question, qIdx) => (
              <Card
                key={qIdx}
                title={`${t('instructor.quizzes.questions.question')} ${qIdx + 1}`}
                extra={
                  <Button
                    type="text"
                    danger
                    size="small"
                    icon={<DeleteOutlined />}
                    onClick={() => removeQuestion(qIdx)}
                  >
                    {t('common.remove')}
                  </Button>
                }
                className="bg-gray-50"
              >
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">{t('instructor.quizzes.questions.questionText')}</label>
                      <Input
                        value={question.name}
                        onChange={(e) => updateQuestion(qIdx, 'name', e.target.value)}
                        placeholder={t('instructor.quizzes.questions.enterQuestion')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">{t('instructor.quizzes.questions.questionScore')}</label>
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
                    <label className="block text-sm font-medium mb-1">{t('instructor.quizzes.questions.description')}</label>
                    <Input.TextArea
                      rows={2}
                      value={question.description}
                      onChange={(e) => updateQuestion(qIdx, 'description', e.target.value)}
                      placeholder={t('instructor.quizzes.questions.descriptionPlaceholder')}
                    />
                  </div>

                  <Divider className="my-3" />

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">{t('instructor.quizzes.answerOptions', { count: question.options.length })}</label>
                      <Button
                        type="dashed"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => addOption(qIdx)}
                      >
                        {t('instructor.quizzes.options.addOption')}
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
                              placeholder={`${t('instructor.quizzes.options.option')} ${oIdx + 1}`}
                            />
                          </div>

                          <div className="mb-2 flex gap-2 items-center justify-between">
                            <div className="flex gap-2 items-center">
                              <Checkbox
                                checked={option.isCorrect}
                                onChange={(e) => updateOption(qIdx, oIdx, 'isCorrect', e.target.checked)}
                              >
                                {t('instructor.quizzes.options.markAsCorrect')}
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
                              {t('instructor.quizzes.questions.score')}: {optionScore.toFixed(2)}
                            </div>
                          </div>

                          <Input.TextArea
                            rows={2}
                            value={option.explanation}
                            onChange={(e) => updateOption(qIdx, oIdx, 'explanation', e.target.value)}
                            placeholder={t('instructor.quizzes.options.explanationPlaceholder')}
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
            {t('instructor.quizzes.questions.addQuestion')}
          </Button>

          <Divider />

          <Space className="mt-4">
            <Button 
              type="primary"
              loading={submitting}
              htmlType="submit"
            >
              {isEditMode ? t('instructor.quizzes.updateQuiz') : t('instructor.quizzes.createQuiz')}
            </Button>
            <Button onClick={() => navigate('/instructor/quizzes')}>
              {t('common.cancel')}
            </Button>
          </Space>
        </Form>
      </Card>
    </div>
  );
}
