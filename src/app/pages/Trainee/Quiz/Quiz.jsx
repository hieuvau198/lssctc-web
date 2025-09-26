import React, { useEffect, useState } from 'react';
import PageNav from '../../../components/PageNav/PageNav';
import QuizHeader from './partials/QuizHeader';
import QuizProgress from './partials/QuizProgress';
import QuizQuestion from './partials/QuizQuestion';
import QuizSummary from './partials/QuizSummary';
import { fetchQuizBySectionQuizId } from '../../../apis/Trainee/TraineeSectionApi';

export default function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [quizTitle, setQuizTitle] = useState('Quiz');
  const [totalTimeSec, setTotalTimeSec] = useState(5 * 60);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    fetchQuizBySectionQuizId(1)
      .then((data) => {
        if (!isMounted) return;
        // Map API shape -> UI shape consumed by QuizQuestion
        const mappedQuestions = Array.isArray(data?.questions)
          ? [...data.questions]
              .map((q) => ({
                id: q.id,
                text: q.name,
                description: q.description,
                options: Array.isArray(q.options)
                  ? [...q.options]
                      .sort((a, b) => (a.displayOrder ?? 0) - (b.displayOrder ?? 0))
                      .map((opt) => ({
                        value: opt.id,
                        label: opt.name,
                        description: opt.description,
                        score: opt.optionScore,
                      }))
                  : [],
              }))
          : [];

        setQuestions(mappedQuestions);
        setQuizTitle(data?.name || 'Quiz');
        const secs = Number(data?.timelimitMinute) > 0 ? Number(data.timelimitMinute) * 60 : 5 * 60;
        setTotalTimeSec(secs);
        setTimeLeft(secs);
        setAnswers(Array(mappedQuestions.length).fill(null));
        setIndex(0);
        setSubmitted(false);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        if (!isMounted) return;
        setError('Không thể tải bài quiz.');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (submitted) return;
    if (loading) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted, loading]);

  function onSelect(val) {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = val;
      return next;
    });
  }

  function nextQ() {
    setIndex((i) => Math.min(questions.length - 1, i + 1));
  }
  function prevQ() {
    setIndex((i) => Math.max(0, i - 1));
  }
  function jumpTo(i) {
    setIndex(i);
  }
  function onSubmit() {
    setSubmitted(true);
  }
  function onRestart() {
    setTimeLeft(totalTimeSec);
    setIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setSubmitted(false);
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] bg-white">
        <div className="mx-auto w-full max-w-[1160px] md:max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10">
          <PageNav nameMap={{ quiz: 'Quiz' }} />
          <QuizSummary questions={questions} answers={answers} onRestart={onRestart} />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] bg-white">
        <div className="mx-auto w-full max-w-[1160px] md:max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-slate-600">Đang tải bài quiz...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] bg-white">
        <div className="mx-auto w-full max-w-[1160px] md:max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="min-h-[60vh] bg-white">
        <div className="mx-auto w-full max-w-[1160px] md:max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-slate-600">Không có câu hỏi.</div>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="min-h-[60vh] bg-white">
      <div className="mx-auto w-full max-w-[1160px] md:max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10">
        <PageNav nameMap={{ quiz: 'Quiz' }} />
        <QuizHeader
          title={quizTitle}
          timeLeftSec={timeLeft}
          totalSec={totalTimeSec}
          current={index + 1}
          total={questions.length}
        />

        <div className="flex flex-col gap-6">
          <QuizQuestion q={q} value={answers[index]} onChange={onSelect} index={index} />

          <div className="flex items-center justify-between">
            <div className="hidden md:block">
              <QuizProgress answers={answers} currentIndex={index} onJump={jumpTo} />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <button onClick={prevQ} disabled={index === 0} className="px-4 py-2 rounded-lg border border-slate-200 text-slate-700 bg-white disabled:opacity-50">Prev</button>
              {index < questions.length - 1 ? (
                <button onClick={nextQ} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700">Next</button>
              ) : (
                <button onClick={onSubmit} className="px-4 py-2 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700">Submit</button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
