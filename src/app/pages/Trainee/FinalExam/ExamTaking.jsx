import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { mockExamQuestions } from '../../../mocks/finalExam';
import HeaderTimer from './partials/HeaderTimer';
import QuestionCard from './partials/QuestionCard';
import QuestionSidebar from './partials/QuestionSidebar';
import SubmitModal from './partials/SubmitModal';

export default function ExamTaking() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const examData = location.state?.examData;

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeRemaining, setTimeRemaining] = useState(examData?.duration * 60 || 3600); // in seconds
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [leaveViolations, setLeaveViolations] = useState(0);
    const hiddenTimerRef = useRef(null);
    const leaveViolationsRef = useRef(0); // track violations without triggering re-render inside event handler
    const modalOpenRef = useRef(false);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0) {
            handleAutoSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeRemaining((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    // Redirect if no exam data
    useEffect(() => {
        if (!examData) {
            navigate('/final-exam/1');
        }
    }, [examData, navigate]);

    const currentQuestion = mockExamQuestions[currentQuestionIndex];

    const handleAnswerChange = (questionId, answerId) => {
        setAnswers((prev) => ({
            ...prev,
            [questionId]: answerId,
        }));
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < mockExamQuestions.length - 1) {
            setCurrentQuestionIndex((prev) => prev + 1);
        }
    };

    const handleQuestionSelect = (index) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmitClick = () => {
        setShowSubmitModal(true);
    };

    const handleAutoSubmit = () => {
        // auto submit immediately
        handleFinalSubmit();
    };

    const handleForceFail = () => {
        // Cancel the exam and give zero score
        // stop any running hidden timer
        if (hiddenTimerRef.current) {
            clearTimeout(hiddenTimerRef.current);
            hiddenTimerRef.current = null;
        }
        // navigate to result with zero score and a flag
        navigate('/final-exam/1/result', {
            state: {
                examData,
                answers,
                score: 0,
                correctCount: 0,
                totalQuestions: mockExamQuestions.length,
                cancelledDueToLeave: true,
            },
        });
    };

    const handleFinalSubmit = () => {
        // Calculate score
        let correctCount = 0;
        mockExamQuestions.forEach((q) => {
            if (answers[q.id] === q.correctAnswer) {
                correctCount++;
            }
        });

        const score = Math.round((correctCount / mockExamQuestions.length) * 100);

        // Navigate to result page
        navigate('/final-exam/1/result', {
            state: {
                examData,
                answers,
                score,
                correctCount,
                totalQuestions: mockExamQuestions.length,
            },
        });
    };

    const answeredCount = Object.keys(answers).length;
    // no banner fallback; use Antd Modal for warnings
    const [overlay, setOverlay] = useState({ visible: false, type: null, msg: '' });
    const overlayBtnRef = useRef(null);
    useEffect(() => {
        if (overlay.visible && overlayBtnRef.current) {
            try { overlayBtnRef.current.focus(); } catch (e) {}
        }
    }, [overlay.visible]);

    // Visibility/leave handling: record when user leaves, show warning when they return
    useEffect(() => {
        const lastHiddenAtRef = { current: null };

        const recordHidden = () => {
            lastHiddenAtRef.current = Date.now();
        };

        const handleReturn = () => {
            const leftAt = lastHiddenAtRef.current;
            lastHiddenAtRef.current = null;
            if (!leftAt) return;
            const awayDuration = Date.now() - leftAt;
            if (awayDuration < 5000) return; // ignore short switches

            const currentViolation = leaveViolationsRef.current + 1;
            leaveViolationsRef.current = currentViolation;
            setLeaveViolations(currentViolation);

            if (currentViolation === 1) {
                const msg = t(
                    'exam.leaveWarningFirst',
                    'Bạn đã rời khỏi trang thi quá lâu. Đây là cảnh báo lần 1. Nếu vi phạm lần 2, bài thi sẽ bị hủy và bạn sẽ nhận 0 điểm.'
                );
                // show overlay fallback immediately so Chrome users always see something
                setOverlay({ visible: true, type: 'warning', msg });
                console.warn('[Exam] return after away:', { awayDuration, violation: currentViolation });
                if (!modalOpenRef.current) {
                    modalOpenRef.current = true;
                    try { window.focus(); } catch (e) {}
                    Modal.confirm({
                        title: t('exam.leaveWarningTitle', 'Cảnh báo'),
                        content: msg,
                        maskClosable: false,
                        zIndex: 200000,
                        getContainer: () => document.body,
                        okText: t('common.ok', 'OK'),
                        onOk: () => {
                            modalOpenRef.current = false;
                            setOverlay({ visible: false, type: null, msg: '' });
                        },
                    });
                }
            } else {
                const msg = t(
                    'exam.leaveWarningFinal',
                    'Bạn đã rời khỏi trang thi lần thứ 2. Bài thi của bạn đã bị hủy và kết quả là 0 điểm.'
                );
                // show overlay fallback immediately so Chrome users always see something
                setOverlay({ visible: true, type: 'final', msg });
                console.error('[Exam] final violation, will cancel on confirm', { awayDuration, violation: currentViolation });
                if (!modalOpenRef.current) {
                    modalOpenRef.current = true;
                    try { window.focus(); } catch (e) {}
                    Modal.confirm({
                        title: t('exam.leaveWarningFinalTitle', 'Bài thi bị hủy'),
                        content: msg,
                        maskClosable: false,
                        zIndex: 200000,
                        getContainer: () => document.body,
                        okText: t('common.ok', 'OK'),
                        onOk: () => {
                            modalOpenRef.current = false;
                            setOverlay({ visible: false, type: null, msg: '' });
                            handleForceFail();
                        },
                    });
                }
            }
        };

        const visibilityHandler = () => {
            if (document.hidden) {
                recordHidden();
            } else {
                handleReturn();
            }
        };

        const blurHandler = () => {
            // treat blur as leaving
            recordHidden();
        };

        const focusHandler = () => {
            handleReturn();
        };

        const beforeUnloadHandler = (e) => {
            e.preventDefault();
            e.returnValue = t('exam.leaveBeforeUnload', 'Bạn có chắc muốn rời khỏi trang? Bài thi có thể bị hủy.');
            return e.returnValue;
        };

        document.addEventListener('visibilitychange', visibilityHandler);
        window.addEventListener('blur', blurHandler);
        window.addEventListener('focus', focusHandler);
        window.addEventListener('beforeunload', beforeUnloadHandler);

        return () => {
            document.removeEventListener('visibilitychange', visibilityHandler);
            window.removeEventListener('blur', blurHandler);
            window.removeEventListener('focus', focusHandler);
            window.removeEventListener('beforeunload', beforeUnloadHandler);
        };
    }, [t]);

    // Screenshot detection: best-effort via PrintScreen key, common mac shortcuts, and pasted images
    useEffect(() => {
        const handleScreenshotAttempt = (source) => {
            console.warn('[Exam] screenshot attempt detected from', source);
            const currentViolation = leaveViolationsRef.current + 1;
            leaveViolationsRef.current = currentViolation;
            setLeaveViolations(currentViolation);

            const firstMsg = t(
                'exam.screenshotWarning',
                'Bạn không được chụp màn hình trong khi làm bài. Đây là cảnh báo lần 1. Lần thứ 2 sẽ hủy bài và cho 0 điểm.'
            );
            const finalMsg = t(
                'exam.screenshotFinal',
                'Phát hiện chụp màn hình lần thứ 2. Bài thi sẽ bị hủy và bạn sẽ nhận 0 điểm.'
            );

            if (currentViolation === 1) {
                setOverlay({ visible: true, type: 'warning', msg: firstMsg });
                if (!modalOpenRef.current) {
                    modalOpenRef.current = true;
                    try { window.focus(); } catch (e) {}
                    Modal.confirm({
                        title: t('exam.leaveWarningTitle', 'Cảnh báo'),
                        content: firstMsg,
                        maskClosable: false,
                        zIndex: 200000,
                        getContainer: () => document.body,
                        okText: t('common.ok', 'OK'),
                        onOk: () => {
                            modalOpenRef.current = false;
                            setOverlay({ visible: false, type: null, msg: '' });
                        },
                    });
                }
            } else {
                setOverlay({ visible: true, type: 'final', msg: finalMsg });
                if (!modalOpenRef.current) {
                    modalOpenRef.current = true;
                    try { window.focus(); } catch (e) {}
                    Modal.confirm({
                        title: t('exam.leaveWarningFinalTitle', 'Bài thi bị hủy'),
                        content: finalMsg,
                        maskClosable: false,
                        zIndex: 200000,
                        getContainer: () => document.body,
                        okText: t('common.ok', 'OK'),
                        onOk: () => {
                            modalOpenRef.current = false;
                            setOverlay({ visible: false, type: null, msg: '' });
                            handleForceFail();
                        },
                    });
                }
            }
        };

        const onKeyDown = (e) => {
            // PrintScreen key (Windows) often has key === 'PrintScreen' or keyCode 44
            if (e.key === 'PrintScreen' || e.keyCode === 44) {
                try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
                handleScreenshotAttempt('PrintScreen');
                return;
            }
            // Windows Snip (Win+Shift+S) - try to detect and block
            // On Windows the Windows key is exposed as metaKey in many browsers
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key && e.key.toLowerCase() === 's')) {
                try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
                handleScreenshotAttempt('win-shift-s');
                return;
            }
            // macOS screenshot shortcuts: Cmd/Ctrl + Shift + 3/4
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4')) {
                try { e.preventDefault(); e.stopPropagation(); } catch (err) {}
                handleScreenshotAttempt('mac-shortcut');
                return;
            }
        };

        const onPaste = (e) => {
            try {
                const items = e.clipboardData && e.clipboardData.items;
                if (!items) return;
                for (let i = 0; i < items.length; i++) {
                    const item = items[i];
                    if (item.type && item.type.indexOf('image') !== -1) {
                        handleScreenshotAttempt('paste-image');
                        break;
                    }
                }
            } catch (err) {
                // ignore
            }
        };

        document.addEventListener('keydown', onKeyDown);
        window.addEventListener('paste', onPaste);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('paste', onPaste);
        };
    }, [t]);

    if (!examData) return null;

    return (
        <div className="min-h-screen bg-slate-50">
            {overlay.visible && (
                <div className="fixed inset-0 z-[200100] flex items-center justify-center bg-black/50">
                    <div className={`w-full max-w-2xl mx-4 bg-white rounded shadow-lg p-6`}> 
                        <h3 className="text-lg font-semibold mb-3">{overlay.type === 'final' ? t('exam.leaveWarningFinalTitle','Bài thi bị hủy') : t('exam.leaveWarningTitle','Cảnh báo')}</h3>
                        <div className="mb-4 text-sm">{overlay.msg}</div>
                        <div className="flex justify-end">
                            <button
                                ref={overlayBtnRef}
                                className="px-4 py-2 bg-blue-600 text-white rounded"
                                onClick={() => {
                                    setOverlay({ visible: false, type: null, msg: '' });
                                    if (overlay.type === 'final') {
                                        handleForceFail();
                                    }
                                }}
                            >
                                {t('common.ok','OK')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <HeaderTimer name={examData.name} current={currentQuestionIndex + 1} total={mockExamQuestions.length} answeredCount={answeredCount} timeRemaining={timeRemaining} />

            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <QuestionCard
                            question={{ ...currentQuestion, index: currentQuestionIndex + 1 }}
                            value={answers[currentQuestion?.id]}
                            onChange={handleAnswerChange}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            isFirst={currentQuestionIndex === 0}
                            isLast={currentQuestionIndex === mockExamQuestions.length - 1}
                            onSubmitClick={handleSubmitClick}
                            timeWarning={timeRemaining < 300}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <QuestionSidebar questions={mockExamQuestions} currentIndex={currentQuestionIndex} answers={answers} onSelect={handleQuestionSelect} />
                    </div>
                </div>
            </div>

            <SubmitModal open={showSubmitModal} onOk={() => { setShowSubmitModal(false); handleFinalSubmit(); }} onCancel={() => setShowSubmitModal(false)} total={mockExamQuestions.length} answeredCount={answeredCount} />
        </div>
    );
}
