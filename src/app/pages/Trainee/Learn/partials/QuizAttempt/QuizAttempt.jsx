// src/app/pages/Trainee/Learn/partials/QuizAttempt/QuizAttempt.jsx

import React, { useState, useEffect } from 'react';
import { Button, Checkbox, Radio, Space, Alert, Spin, Tag, Progress } from 'antd';
import { Clock, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

// Child component for a single question
const QuestionCard = ({ question, questionIndex, selectedAnswers, onChange, totalQuestions }) => {
  const questionId = question.id;

  const handleRadioChange = (e) => {
    onChange(questionId, [e.target.value]);
  };

  const handleCheckboxChange = (checkedValues) => {
    onChange(questionId, checkedValues);
  };

  const currentValue = selectedAnswers[questionId] || [];
  const isAnswered = currentValue.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-blue-50/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
            isAnswered 
              ? 'bg-blue-600 text-white' 
              : 'bg-slate-200 text-slate-600'
          }`}>
            {questionIndex + 1}
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">{question.name}</h3>
            {question.isMultipleAnswers && (
              <span className="text-xs text-slate-500">Select all that apply</span>
            )}
          </div>
        </div>
        <Tag color={isAnswered ? 'blue' : 'default'} className="text-xs">
          {isAnswered ? 'Answered' : 'Unanswered'}
        </Tag>
      </div>

      <div className="p-6">
        {question.description && (
          <p className="text-slate-600 mb-4">{question.description}</p>
        )}

        {question.isMultipleAnswers ? (
          <Checkbox.Group
            className="w-full"
            value={currentValue}
            onChange={handleCheckboxChange}
          >
            <Space direction="vertical" className="w-full">
              {question.options.map((opt) => (
                <div 
                  key={opt.id} 
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    currentValue.includes(opt.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <Checkbox value={opt.id} className="w-full">
                    <span className="text-slate-700">{opt.name}</span>
                  </Checkbox>
                </div>
              ))}
            </Space>
          </Checkbox.Group>
        ) : (
          <Radio.Group
            className="w-full"
            value={currentValue[0]}
            onChange={handleRadioChange}
          >
            <Space direction="vertical" className="w-full">
              {question.options.map((opt) => (
                <div 
                  key={opt.id} 
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    currentValue[0] === opt.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <Radio value={opt.id} className="w-full">
                    <span className="text-slate-700">{opt.name}</span>
                  </Radio>
                </div>
              ))}
            </Space>
          </Radio.Group>
        )}
      </div>
    </div>
  );
};

// Main component
export default function QuizAttempt({ quizData, onSubmit, isSubmitting }) {
  const { questions, timelimitMinute, quizName } = quizData;
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timelimitMinute * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  const answeredCount = Object.keys(selectedAnswers).filter(k => selectedAnswers[k]?.length > 0).length;
  const progressPercent = Math.round((answeredCount / questions.length) * 100);

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (isTimerRunning) {
        console.log('Time is up! Auto-submitting.');
        setIsTimerRunning(false);
        handleSubmit(true);
      }
      return;
    }
    
    if (!isTimerRunning) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerRunning]);

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Update state on selection
  const handleAnswerChange = (questionId, optionIds) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIds,
    }));
  };
  
  const handleSubmit = () => {
    console.log('[QuizAttempt] handleSubmit triggered.');
    setIsTimerRunning(false);

    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionIds]) => ({
        questionId: parseInt(questionId, 10),
        selectedOptionIds: selectedOptionIds,
      })
    );

    console.log('[QuizAttempt] Submitting with payload:', formattedAnswers);
    onSubmit(formattedAnswers);
  };

  const isLowTime = timeLeft < 300;
  const isCriticalTime = timeLeft < 60;

  return (
    <Spin spinning={isSubmitting} tip="Submitting your answers...">
      <div className="space-y-6">
        {/* Sticky Header */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm rounded-2xl border border-slate-200 shadow-lg p-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">{quizName}</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-slate-500">
                  {answeredCount}/{questions.length} answered
                </span>
                <Progress 
                  percent={progressPercent} 
                  size="small" 
                  showInfo={false}
                  strokeColor={{ from: '#3b82f6', to: '#6366f1' }}
                  className="w-24"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg font-bold ${
                isCriticalTime 
                  ? 'bg-red-100 text-red-600 animate-pulse' 
                  : isLowTime 
                    ? 'bg-amber-100 text-amber-600'
                    : 'bg-blue-100 text-blue-600'
              }`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>

              {/* Submit Button */}
              <Button 
                type="primary" 
                size="large"
                icon={<Send className="w-4 h-4" />}
                onClick={() => handleSubmit(false)}
                loading={isSubmitting}
                className="shadow-lg shadow-blue-200"
              >
                Submit
              </Button>
            </div>
          </div>
        </div>

        {/* Time Warning */}
        {isLowTime && (
          <Alert
            message={isCriticalTime ? "Less than 1 minute remaining!" : "Less than 5 minutes remaining!"}
            type={isCriticalTime ? "error" : "warning"}
            showIcon
            icon={<AlertTriangle className="w-5 h-5" />}
            className="rounded-xl"
          />
        )}

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((q, index) => (
            <QuestionCard
              key={q.id}
              question={q}
              questionIndex={index}
              totalQuestions={questions.length}
              selectedAnswers={selectedAnswers}
              onChange={handleAnswerChange}
            />
          ))}
        </div>

        {/* Bottom Submit */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center">
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 text-slate-600 mb-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{answeredCount} of {questions.length} questions answered</span>
            </div>
            <Progress 
              percent={progressPercent} 
              strokeColor={{ from: '#3b82f6', to: '#6366f1' }}
              className="max-w-md mx-auto"
            />
          </div>
          <Button 
            type="primary" 
            size="large"
            icon={<Send className="w-4 h-4" />}
            onClick={() => handleSubmit(false)}
            loading={isSubmitting}
            className="px-8 shadow-lg shadow-blue-200"
          >
            Submit Quiz
          </Button>
        </div>
      </div>
    </Spin>
  );
}