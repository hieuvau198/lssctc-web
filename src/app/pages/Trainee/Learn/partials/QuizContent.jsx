// src/app/pages/Trainee/Learn/partials/QuizContent.jsx

import React, { useState } from 'react';
import QuizAttempt from './QuizAttempt/QuizAttempt';
import { Button, Alert, Descriptions, Tag, Progress, Space } from 'antd';
import { ClockCircleOutlined, CheckCircleOutlined, StarOutlined, QuestionCircleOutlined } from '@ant-design/icons';

// Child component for quiz start screen
const QuizStartScreen = ({ quiz, onStart }) => (
  <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
    <h1 className="text-3xl font-bold text-gray-900 mb-4">{quiz.quizName}</h1>
    <p className="text-lg text-gray-700 mb-6">{quiz.description}</p>

    <Descriptions bordered column={1} size="middle">
      <Descriptions.Item label="Time Limit" labelStyle={{ width: '150px' }}>
        <ClockCircleOutlined className="mr-2" />
        {quiz.timelimitMinute} minutes
      </Descriptions.Item>
      <Descriptions.Item label="Questions">
        <QuestionCircleOutlined className="mr-2" />
        {quiz.questions?.length || 0} questions
      </Descriptions.Item>
      <Descriptions.Item label="Passing Score">
        <StarOutlined className="mr-2" />
        {quiz.passScoreCriteria} / {quiz.totalScore} points
      </Descriptions.Item>
    </Descriptions>

    <div className="text-center mt-8">
      <Button type="primary" size="large" onClick={onStart}>
        Start Quiz
      </Button>
    </div>
  </div>
);

// Child component for quiz result screen
const QuizResultScreen = ({ quiz, onRestart }) => {
  const isPass = (quiz.attemptScore || 0) >= (quiz.passScoreCriteria || 0);
  const scorePercent = (quiz.totalScore > 0) ? (quiz.attemptScore / quiz.totalScore) * 100 : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">Quiz Result</h1>
      <p className="text-lg text-gray-700 mb-6">{quiz.quizName}</p>

      <div className="my-8">
        <Progress
          type="circle"
          percent={scorePercent}
          format={() => `${quiz.attemptScore} / ${quiz.totalScore}`}
          strokeColor={isPass ? '#52c41a' : '#f5222d'}
        />
      </div>

      {isPass ? (
        <Alert
          message="Congratulations! You Passed."
          description={`You scored ${quiz.attemptScore} out of ${quiz.totalScore} points.`}
          type="success"
          showIcon
        />
      ) : (
        <Alert
          message="You Did Not Pass."
          description={`You scored ${quiz.attemptScore} out of ${quiz.totalScore}. A score of ${quiz.passScoreCriteria} is required to pass.`}
          type="error"
          showIcon
        />
      )}

      <div className="mt-8">
        <Space>
          <Tag color="blue">
            Completed on: {new Date(quiz.lastAttemptDate).toLocaleString()}
          </Tag>
          {/* <Button onClick={onRestart}>Retake Quiz</Button> */}
        </Space>
      </div>
    </div>
  );
};

// Main component
export default function QuizContent({ sectionQuiz, partition, onReload, onSubmitAttempt }) {
  // state: 'start', 'attempting', 'result'
  const [quizState, setQuizState] = useState(
    sectionQuiz.isCompleted ? 'result' : 'start'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStartQuiz = () => {
    setQuizState('attempting');
  };

  // This function is called by QuizAttempt
  const handleSubmit = async (answers) => {
    console.log('[QuizContent] handleSubmit triggered. Forwarding to LearnContent...'); // <-- LOG
    setIsSubmitting(true);
    try {
      // Call the submit function passed from LearnContent
      await onSubmitAttempt(answers);
      // On success, LearnContent will trigger 'onReload'
      // which will cause this component to show the 'result' state
      setQuizState('result');
      console.log('[QuizContent] Submission successful.'); // <-- LOG
    } catch (error) {
      console.error('Submission failed in QuizContent:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (quizState === 'attempting') {
    return (
      <QuizAttempt
        quizData={sectionQuiz} // Pass all quiz data
        onSubmit={handleSubmit} // Pass the handler
        isSubmitting={isSubmitting}
      />
    );
  }

  if (quizState === 'result') {
    return (
      <QuizResultScreen
        quiz={sectionQuiz}
        onRestart={() => setQuizState('start')}
      />
    );
  }

  // Default is 'start'
  return (
    <QuizStartScreen
      quiz={sectionQuiz}
      onStart={handleStartQuiz}
    />
  );
}