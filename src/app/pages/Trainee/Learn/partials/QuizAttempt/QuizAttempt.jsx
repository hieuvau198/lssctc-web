// src\app\pages\Trainee\Learn\partials\QuizAttempt\QuizAttempt.jsx

import React, { useEffect, useState } from "react";
import { Card, Spin, Alert, Button, message, Checkbox, Radio } from "antd";
import {
  getQuizWithoutAnswers,
  submitSectionQuizAttempt,
  mapQuizAttempt,
} from "../../../../../apis/Trainee/TraineeQuizApi";

export default function QuizAttempt({ sectionQuiz, partition }) {
  const traineeId = 1; // TODO: replace with real logged-in user later

  const [quizData, setQuizData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!sectionQuiz?.quizId) return;

    const fetchQuiz = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log("Fetching quiz:", sectionQuiz.quizId);
        const data = await getQuizWithoutAnswers(sectionQuiz.quizId);
        console.log("Fetched quiz data:", data);
        setQuizData(data);
      } catch (err) {
        console.error("❌ Error fetching quiz data:", err);
        setError("Failed to load quiz data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [sectionQuiz]);

  if (!sectionQuiz) {
    return (
      <div className="p-6 text-center text-slate-500">
        No quiz selected.
      </div>
    );
  }

  const handleSelect = (questionId, optionId, isMultiple) => {
    setAnswers((prev) => {
      const prevSelected = prev[questionId] || [];
      let newSelected;

      if (isMultiple) {
        newSelected = prevSelected.includes(optionId)
          ? prevSelected.filter((id) => id !== optionId)
          : [...prevSelected, optionId];
      } else {
        newSelected = [optionId];
      }

      return { ...prev, [questionId]: newSelected };
    });
  };

  // 🟥 Handle submit quiz
  const handleSubmit = async () => {
    if (!quizData || !sectionQuiz || !partition) return;

    const formattedAnswers = Object.entries(answers).map(([questionId, selectedIds]) => ({
      questionId: parseInt(questionId),
      selectedOptionIds: selectedIds,
    }));

    if (formattedAnswers.length === 0) {
      message.warning("Please select at least one answer before submitting.");
      return;
    }

    const attemptPayload = mapQuizAttempt(sectionQuiz.quizId, sectionQuiz.sectionQuizId, formattedAnswers);

    try {
      setSubmitting(true);
      const result = await submitSectionQuizAttempt(partition.sectionPartitionId, traineeId, attemptPayload);
      message.success("✅ Quiz submitted successfully!");
      setResult(result);
    } catch (err) {
      console.error("❌ Error submitting quiz:", err);
      message.error("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin tip="Loading quiz..." size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto">
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
        />
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="text-center py-12 text-slate-500">
        No quiz data found.
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-3xl mx-auto mt-6 text-center">
        <Card title="Quiz Result">
          <p className="text-lg font-semibold text-slate-700">{result.quizName}</p>
          <p className="text-slate-600 mt-2">Total Score: {result.totalScore ?? "-"}</p>
          <p className="text-slate-600">Your Score: {result.attemptScore ?? "-"}</p>
          <p className={`mt-4 text-lg font-bold ${result.lastAttemptIsPass ? "text-green-600" : "text-red-600"}`}>
            {result.lastAttemptIsPass ? "🎉 You Passed!" : "❌ You Failed."}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            Attempted on: {new Date(result.lastAttemptDate).toLocaleString()}
          </p>
        </Card>
      </div>
    );
  }
  
  return (
  <div className=" mx-auto px-4 py-8">
    {/* Quiz Header */}
    <Card
      className="border border-gray-200 shadow-sm mb-8"
    >
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Test: {quizData.name}
      </h2>
      <p className="text-gray-600 mb-4">{quizData.description}</p>

      <div className="flex flex-wrap text-sm text-gray-600 gap-x-8 gap-y-1">
        <div>
          <span className="font-medium text-gray-800">Time Limit:</span>{" "}
          {quizData.timelimitMinute ?? "No limit"} mins
        </div>
        <div>
          <span className="font-medium text-gray-800">Total Score:</span>{" "}
          {quizData.totalScore ?? "-"}
        </div>
        <div>
          <span className="font-medium text-gray-800">Pass Score:</span>{" "}
          {quizData.passScoreCriteria ?? "-"}
        </div>
      </div>
    </Card>

    {/* Quiz Questions */}
    <div className="space-y-8">
      {quizData.questions?.map((q, i) => (
        <div
          key={q.id}
          className="border-t border-gray-200 pt-6 first:border-t-0"
        >
          {/* Question text */}
          <h3 className="text-base font-semibold text-gray-900 mb-4">
            {q.name}. {q.description}
          </h3>

          {/* Options */}
          <div className="space-y-3">
            {q.isMultipleAnswers ? (
              <Checkbox.Group
                value={answers[q.id] || []}
                onChange={(vals) => setAnswers((prev) => ({ ...prev, [q.id]: vals }))}
              >
                <div className="flex flex-col gap-3">
                  {q.options.map((opt) => (
                    <Checkbox
                      key={opt.id}
                      value={opt.id}
                      className="text-gray-700 hover:text-black"
                    >
                      {opt.name || opt.description}
                    </Checkbox>
                  ))}
                </div>
              </Checkbox.Group>
            ) : (
              <Radio.Group
                value={answers[q.id]?.[0] || null}
                onChange={(e) => handleSelect(q.id, e.target.value, false)}
              >
                <div className="flex flex-col gap-3">
                  {q.options.map((opt) => (
                    <Radio
                      key={opt.id}
                      value={opt.id}
                      className="text-gray-700 hover:text-black"
                    >
                      {opt.name || opt.description}
                    </Radio>
                  ))}
                </div>
              </Radio.Group>
            )}
          </div>
        </div>
      ))}
    </div>

    {/* Submit button */}
    <div className="flex justify-center mt-10">
      <Button
        type="primary"
        size="large"
        onClick={handleSubmit}
        loading={submitting}
        disabled={submitting}
        className="min-w-[200px] font-semibold tracking-wide"
      >
        Submit Quiz
      </Button>
    </div>
  </div>
);

}
