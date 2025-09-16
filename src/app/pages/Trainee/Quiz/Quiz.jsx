import React, { useEffect, useMemo, useState } from 'react';
import QuizHeader from './partials/QuizHeader';
import QuizProgress from './partials/QuizProgress';
import QuizQuestion from './partials/QuizQuestion';
import QuizSummary from './partials/QuizSummary';

export default function Quiz() {
  // Mock quiz data; replace later with API hook.
  const questions = useMemo(() => ([
    {
      id: 'q1',
      text: 'What is the safe minimum distance from a power line for crane operations?',
      options: [
        { value: '1m', label: '1 meter' },
        { value: '3m', label: '3 meters' },
        { value: '10m', label: '10 meters' },
        { value: '50m', label: '50 meters' },
      ],
      correct: '10m',
      explanation: 'Regulations often require at least 10 meters depending on voltage and local code.',
    },
    {
      id: 'q2',
      text: 'Which factor most affects crane load capacity?',
      options: [
        { value: 'boom-angle', label: 'Boom angle' },
        { value: 'paint-color', label: 'Paint color' },
        { value: 'operator-age', label: 'Operator age' },
        { value: 'radio-volume', label: 'Radio volume' },
      ],
      correct: 'boom-angle',
      explanation: 'Load charts show capacity varies with boom angle, radius, and configuration.',
    },
    {
      id: 'q3',
      text: 'Before lifting, which check is essential?',
      options: [
        { value: 'rigging', label: 'Inspect rigging and load balance' },
        { value: 'stickers', label: 'Check for new decals' },
        { value: 'music', label: 'Ensure music playlist is set' },
        { value: 'photos', label: 'Take promotional photos' },
      ],
      correct: 'rigging',
      explanation: 'Rigging inspection ensures safe lifting and stability.',
    },
  ]), []);

  const totalTimeSec = 5 * 60; // 5 minutes
  const [timeLeft, setTimeLeft] = useState(totalTimeSec);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, submitted]);

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
          <QuizSummary questions={questions} answers={answers} onRestart={onRestart} />
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="min-h-[60vh] bg-white">
      <div className="mx-auto w-full max-w-[1160px] md:max-w-[1320px] px-4 sm:px-6 lg:px-8 py-10">
        <QuizHeader
          title="Safety Basics Quiz"
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
