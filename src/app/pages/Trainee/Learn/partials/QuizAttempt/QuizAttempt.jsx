// src/app/pages/Trainee/Learn/partials/QuizAttempt/QuizAttempt.jsx

import React, { useState, useEffect } from 'react';
import { Checkbox, Radio, Space, Spin } from 'antd';
import { Clock, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

// Child component for a single question - Industrial theme
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
    <div className="bg-white border-2 border-neutral-900 overflow-hidden">
      <div className={`h-2 ${isAnswered ? 'bg-yellow-400' : 'bg-neutral-200'}`} />
      <div className="px-6 py-4 border-b-2 border-neutral-200 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 flex items-center justify-center text-sm font-black ${isAnswered
            ? 'bg-yellow-400 text-black'
            : 'bg-neutral-200 text-neutral-600'
            }`}>
            {questionIndex + 1}
          </div>
          <div>
            <h3 className="font-black text-neutral-900 uppercase">{question.name}</h3>
            {question.isMultipleAnswers && (
              <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold">Select all that apply</span>
            )}
          </div>
        </div>
        <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider ${isAnswered ? 'bg-yellow-400 text-black' : 'bg-neutral-100 text-neutral-500'}`}>
          {isAnswered ? 'Đã chọn' : 'Chưa chọn'}
        </span>
      </div>

      <div className="p-6">
        {question.description && (
          <p className="text-neutral-600 mb-4">{question.description}</p>
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
                  className={`p-4 border-2 transition-all cursor-pointer ${currentValue.includes(opt.id)
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-neutral-200 hover:border-yellow-400'
                    }`}
                >
                  <Checkbox value={opt.id} className="w-full">
                    <span className="text-neutral-700 font-medium">{opt.name}</span>
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
                  className={`p-4 border-2 transition-all cursor-pointer ${currentValue[0] === opt.id
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-neutral-200 hover:border-yellow-400'
                    }`}
                >
                  <Radio value={opt.id} className="w-full">
                    <span className="text-neutral-700 font-medium">{opt.name}</span>
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
        {/* Sticky Header - Industrial */}
        <div className="sticky top-0 z-20 bg-white border-2 border-neutral-900 p-4">
          <div className="h-1 bg-yellow-400 -mx-4 -mt-4 mb-4" />
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-black text-neutral-900 uppercase">{quizName}</h2>
              <div className="flex items-center gap-4 mt-1">
                <span className="text-sm text-neutral-500 font-semibold uppercase tracking-wider">
                  {answeredCount}/{questions.length} câu hỏi
                </span>
                <div className="w-24 h-2 border-2 border-neutral-900 bg-white">
                  <div
                    className="h-full bg-yellow-400 transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 px-4 py-2 font-mono text-lg font-black border-2 ${isCriticalTime
                ? 'border-red-500 bg-red-50 text-red-600 animate-pulse'
                : isLowTime
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-700'
                  : 'border-neutral-900 bg-white text-neutral-900'
                }`}>
                <Clock className="w-5 h-5" />
                {formatTime(timeLeft)}
              </div>

              {/* Submit Button */}
              <button
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                Nộp
              </button>
            </div>
          </div>
        </div>

        {/* Time Warning */}
        {isLowTime && (
          <div className={`flex items-center gap-3 p-4 border-2 ${isCriticalTime ? 'border-red-500 bg-red-50' : 'border-yellow-400 bg-yellow-50'}`}>
            <AlertTriangle className={`w-5 h-5 ${isCriticalTime ? 'text-red-500' : 'text-yellow-600'}`} />
            <span className={`font-bold uppercase ${isCriticalTime ? 'text-red-700' : 'text-yellow-700'}`}>
              {isCriticalTime ? "Less than 1 minute remaining!" : "Less than 5 minutes remaining!"}
            </span>
          </div>
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
        <div className="bg-white border-2 border-neutral-900 p-6 text-center">
          <div className="h-1 bg-yellow-400 -mx-6 -mt-6 mb-6" />
          <div className="mb-4">
            <div className="flex items-center justify-center gap-2 text-neutral-600 mb-2">
              <span className="font-semibold uppercase tracking-wider">{answeredCount} trên {questions.length} câu hỏi đã trả lời</span>
            </div>
            <div className="max-w-md mx-auto h-3 border-2 border-neutral-900 bg-white">
              <div
                className="h-full bg-yellow-400 transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-8 py-3 bg-yellow-400 text-black font-bold uppercase tracking-wider border-2 border-black hover:bg-yellow-500 hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            Nộp bài
          </button>
        </div>
      </div>
    </Spin>
  );
}