// src\app\pages\Trainee\Quiz\partials\QuizSummary.jsx

import React from 'react';
import { useTranslation } from 'react-i18next';

export default function QuizSummary({ questions, answers, onRestart }) {
  const { t } = useTranslation();
  // For demo, assume each question has correct value at q.correct
  const score = questions.reduce((acc, q, i) => acc + (answers[i] === q.correct ? 1 : 0), 0);
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">{t('trainee.quizSummary.title')}</h2>
      <p className="mt-1 text-slate-600">{t('trainee.quizSummary.score', { score, total: questions.length })}</p>

      <div className="mt-4 space-y-3">
        {questions.map((q, i) => {
          const correct = answers[i] === q.correct;
          return (
            <div key={i} className={`p-3 rounded-lg border ${correct ? 'bg-green-50 border-green-200 text-green-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
              <div className="font-medium">Q{i + 1}: {q.text}</div>
              <div className="text-sm mt-1">
                {t('trainee.quizSummary.yourAnswer')}: <span className="font-medium">{String(answers[i] ?? '—')}</span>
                {q.explanation && (
                  <>
                    <span className="mx-2 text-slate-400">•</span>
                    <span className="text-slate-700">{q.explanation}</span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        <button onClick={onRestart} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">{t('trainee.quizSummary.retakeQuiz')}</button>
      </div>
    </div>
  );
}
