// src\app\pages\Trainee\Learn\partials\QuizAttempt\QuizAttempt.jsx

import React, { useEffect, useState } from "react";
import { Card, Spin, Alert } from "antd";
import { getQuizWithoutAnswers } from "../../../../../apis/Trainee/TraineeQuizApi";

/**
 * Component to display the actual quiz attempt screen.
 * It receives sectionQuiz from parent (QuizContent),
 * uses sectionQuiz.quizId to fetch quiz details and questions.
 */
export default function QuizAttempt({ sectionQuiz }) {
  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="max-w-4xl mx-auto">
      <Card title={quizData.name} className="mb-6">
        <p className="text-slate-600 mb-4">{quizData.description}</p>

        <div className="text-sm text-slate-500 mb-4">
          <strong>Time Limit:</strong> {quizData.timelimitMinute ?? "No limit"} mins<br />
          <strong>Total Score:</strong> {quizData.totalScore ?? "-"}<br />
          <strong>Pass Score:</strong> {quizData.passScoreCriteria ?? "-"}
        </div>
      </Card>

      {quizData.questions?.map((q, i) => (
        <Card key={q.id} className="mb-4">
          <div className="mb-2 font-semibold text-slate-900">
            {i + 1}. {q.description}
          </div>

          <ul className="space-y-2">
            {q.options?.map((opt) => (
              <li
                key={opt.id}
                className="p-2 border rounded hover:bg-slate-50 transition"
              >
                {opt.description}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
