// src/app/pages/Trainee/Learn/partials/QuizAttempt/QuizAttempt.jsx

import React, { useState, useEffect } from 'react';
import { Button, Card, Checkbox, Radio, Space, Typography, Alert, Modal, Spin } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Child component for a single question
const QuestionCard = ({ question, questionIndex, selectedAnswers, onChange }) => {
  const questionId = question.id;

  const handleRadioChange = (e) => {
    onChange(questionId, [e.target.value]); // Radio (single choice)
  };

  const handleCheckboxChange = (checkedValues) => {
    onChange(questionId, checkedValues); // Checkbox (multiple choice)
  };

  const currentValue = selectedAnswers[questionId] || [];

  return (
    <Card
      className="mb-6 shadow-md"
      title={<Title level={5}>{`Question ${questionIndex + 1}: ${question.name}`}</Title>}
    >
      {question.description && <Paragraph type="secondary">{question.description}</Paragraph>}

      {question.isMultipleAnswers ? (
        <Checkbox.Group
          className="w-full"
          value={currentValue}
          onChange={handleCheckboxChange}
        >
          <Space direction="vertical" className="w-full">
            {question.options.map((opt) => (
              <Checkbox key={opt.id} value={opt.id} className="text-base p-2">
                {opt.name}
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      ) : (
        <Radio.Group
          className="w-full"
          value={currentValue[0]} // Radio only has 1 value
          onChange={handleRadioChange}
        >
          <Space direction="vertical" className="w-full">
            {question.options.map((opt) => (
              <Radio key={opt.id} value={opt.id} className="text-base p-2">
                {opt.name}
              </Radio>
            ))}
          </Space>
        </Radio.Group>
      )}
    </Card>
  );
};

// Main component
export default function QuizAttempt({ quizData, onSubmit, isSubmitting }) {
  const { questions, timelimitMinute, quizName } = quizData;
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(timelimitMinute * 60); // in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(true); // Control timer

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0) {
      if (isTimerRunning) { // Only auto-submit once
        console.log('Time is up! Auto-submitting.');
        setIsTimerRunning(false);
        handleSubmit(true); // Pass flag to bypass confirm modal
      }
      return;
    }
    
    if (!isTimerRunning) {
      return; // Stop timer if not running
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

    // Stop the timer
    setIsTimerRunning(false);

    // Format the answers
    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionIds]) => ({
        questionId: parseInt(questionId, 10),
        selectedOptionIds: selectedOptionIds,
      })
    );

    console.log('[QuizAttempt] Submitting with payload:', formattedAnswers);
    onSubmit(formattedAnswers); // Call parent (QuizContent) onSubmit
  };

  return (
    <Spin spinning={isSubmitting} tip="Submitting...">
      <div className="max-w-4xl mx-auto p-4">
        <Title level={2} className="text-center">{quizName}</Title>

        <Card className="mb-6 sticky top-4 z-10 shadow-lg">
          <div className="flex justify-between items-center">
            <Title level={4} className="mb-0">
              <ClockCircleOutlined className="mr-2" />
              Time Remaining:
              <span className={`ml-2 font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-blue-600'}`}>
                {formatTime(timeLeft)}
              </span>
            </Title>
            <Button 
              type="primary" 
              size="large" 
              onClick={() => handleSubmit(false)} // Ensure it calls with bypass=false
              loading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </Card>

        {timeLeft <= 300 && (
          <Alert
            message="You have less than 5 minutes remaining!"
            type="warning"
            showIcon
            className="mb-4"
          />
        )}

        {questions.map((q, index) => (
          <QuestionCard
            key={q.id}
            question={q}
            questionIndex={index}
            selectedAnswers={selectedAnswers}
            onChange={handleAnswerChange}
          />
        ))}

        <div className="text-center mt-8">
          <Button 
            type="primary" 
            size="large" 
            onClick={() => handleSubmit(false)} // Ensure it calls with bypass=false
            loading={isSubmitting}
          >
            Submit
          </Button>
        </div>
      </div>
    </Spin>
  );
}