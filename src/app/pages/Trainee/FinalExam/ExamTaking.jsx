import React, { useState, useEffect, useRef } from 'react';
import { Modal, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { mockExamQuestions, mockFinalExam } from '../../../mocks/finalExam';
import CryptoJS from 'crypto-js';
import PartialApi from '../../../apis/FinalExam/PartialApi';
import HeaderTimer from './partials/HeaderTimer';
import QuestionCard from './partials/QuestionCard';
import QuestionSidebar from './partials/QuestionSidebar';
import SubmitModal from './partials/SubmitModal';

export default function ExamTaking() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();
    // Try to restore examData from location.state, then sessionStorage, then mock
    const persisted = (() => {
        try {
            const key = id ? `finalExam_${id}_data` : null;
            if (location.state?.examData) return location.state.examData;
            if (key) {
                const raw = sessionStorage.getItem(key);
                if (raw) return JSON.parse(raw);
            }
            // fallback to mock if available and id matches
            if (mockFinalExam && String(mockFinalExam.id) === String(id)) return mockFinalExam;
            return null;
        } catch (e) {
            return null;
        }
    })();
    const [examData, setExamData] = useState(persisted);

    const [questions, setQuestions] = useState(() => {
        if (location.state?.sessionData?.questions) {
            return location.state.sessionData.questions;
        }
        const key = id ? `finalExam_${id}_questions` : null;
        if (key) {
            try {
                const stored = sessionStorage.getItem(key);
                if (stored) return JSON.parse(stored);
            } catch (e) { }
        }
        return mockExamQuestions;
    });

    useEffect(() => {
        if (id && questions && questions.length > 0) {
            sessionStorage.setItem(`finalExam_${id}_questions`, JSON.stringify(questions));
        }
    }, [questions, id]);

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const answersRef = useRef(answers);
    const [timeRemaining, setTimeRemaining] = useState(() => (examData?.duration ? examData.duration * 60 : 3600)); // in seconds

    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [leaveViolations, setLeaveViolations] = useState(0);
    const hiddenTimerRef = useRef(null);
    const leaveViolationsRef = useRef(0); // track violations without triggering re-render inside event handler
    const modalOpenRef = useRef(false);

    // (Replaced) timer is driven by authoritative start timestamp effect below

    // Encryption key for local storage (fallback to deterministic dev key)
    const ENC_KEY = import.meta.env.VITE_CRYPTO_KEY || 'lssctc-dev-fallback-key-2024';
    const answersKey = id ? `finalExam_${id}_answers` : null;

    const encrypt = (obj) => {
        try {
            return CryptoJS.AES.encrypt(JSON.stringify(obj), ENC_KEY).toString();
        } catch (e) {
            console.error('encrypt error', e);
            return null;
        }
    };

    const decrypt = (str) => {
        try {
            const bytes = CryptoJS.AES.decrypt(str, ENC_KEY);
            const plain = bytes.toString(CryptoJS.enc.Utf8);
            if (!plain) return null;
            return JSON.parse(plain);
        } catch (e) {
            console.error('decrypt error', e);
            return null;
        }
    };

    const saveAnswersToStorage = (payload) => {
        if (!answersKey) return;
        try {
            const toSave = { answers: payload || answersRef.current || {}, ts: Date.now() };
            const cipher = encrypt(toSave);
            if (cipher) localStorage.setItem(answersKey, cipher);
        } catch (e) {
            console.error('Failed to save answers to storage', e);
        }
    };

    const loadAnswersFromStorage = () => {
        if (!answersKey) return null;
        try {
            const raw = localStorage.getItem(answersKey);
            if (!raw) return null;
            const parsed = decrypt(raw);
            if (!parsed || !parsed.answers) return null;
            return parsed.answers;
        } catch (e) {
            console.error('Failed to load answers from storage', e);
            return null;
        }
    };

    const clearAnswersStorage = () => {
        if (!answersKey) return;
        try { localStorage.removeItem(answersKey); } catch (e) { }
    };

    // Redirect if no exam data
    useEffect(() => {
        if (!examData) {
            navigate('/final-exam/1');
            return;
        }
        // persist examData to sessionStorage so refresh preserves it
        try {
            const key = id ? `finalExam_${id}_data` : null;
            if (key) sessionStorage.setItem(key, JSON.stringify(examData));
        } catch (e) { }
    }, [examData, navigate, id]);

    // Restore answers from localStorage when examData is ready
    useEffect(() => {
        if (!examData) return;
        const saved = loadAnswersFromStorage();
        if (saved) {
            setAnswers(saved);
            answersRef.current = saved;
        }
    }, [examData]);

    // Autosave answers every 60 seconds
    useEffect(() => {
        if (!examData) return;
        const intervalId = setInterval(() => {
            saveAnswersToStorage();
            // lightweight feedback in console
            // console.debug('[Exam] autosaved answers');
        }, 60000);
        return () => clearInterval(intervalId);
    }, [examData]);

    // Manage start timestamp and make timer resilient to refresh: store start time once
    useEffect(() => {
        if (!examData) return;
        const startKey = id ? `finalExam_${id}_start` : null;
        try {
            let start = startKey ? sessionStorage.getItem(startKey) : null;
            if (!start) {
                // set start now
                start = String(Date.now());
                if (startKey) sessionStorage.setItem(startKey, start);
            }

            // compute remaining based on elapsed
            const elapsed = Math.floor((Date.now() - Number(start)) / 1000);
            const rem = Math.max((examData.duration || 60) * 60 - elapsed, 0);
            setTimeRemaining(rem);

            // update timer from authoritative start timestamp every second
            const tick = () => {
                try {
                    const s = startKey ? Number(sessionStorage.getItem(startKey) || start) : Number(start);
                    const r = Math.max((examData.duration || 60) * 60 - Math.floor((Date.now() - s) / 1000), 0);
                    setTimeRemaining(r);
                    if (r <= 0) {
                        // auto submit when time up
                        handleAutoSubmit();
                    }
                } catch (err) {
                    console.error('Timer tick error', err);
                }
            };
            const timerId = setInterval(tick, 1000);
            return () => clearInterval(timerId);
        } catch (e) {
            console.error('Failed to init exam timer', e);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [examData, id]);

    const currentQuestion = questions[currentQuestionIndex];

    const handleAnswerChange = (questionId, answerValue) => {
        setAnswers((prev) => {
            const next = { ...prev, [questionId]: answerValue };
            answersRef.current = next;
            return next;
        });
    };

    const handleManualSave = async () => {
        if (saveLoading) return;
        setSaveLoading(true);
        try {
            saveAnswersToStorage();
            // Ensure loading visible at least 1s so users notice
            await new Promise((res) => setTimeout(res, 1000));
            message.success('Đã lưu đáp án tạm thời');
        } catch (e) {
            console.error('Manual save error', e);
            message.error('Lưu thất bại');
        } finally {
            setSaveLoading(false);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
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
        // clear persisted state
        try {
            if (id) {
                sessionStorage.removeItem(`finalExam_${id}_start`);
                sessionStorage.removeItem(`finalExam_${id}_data`);
                clearAnswersStorage();
            }
        } catch (e) { }
        // navigate to result with zero score and a flag
        navigate(`/final-exam/${id}/result`, {
            state: {
                examData,
                answers,
                score: 0,
                correctCount: 0,
                totalQuestions: questions.length,
                cancelledDueToLeave: true,
            },
        });
    };

    const handleFinalSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        const answerList = Object.entries(answers).map(([qId, val]) => {
            const questionId = parseInt(qId);
            if (Array.isArray(val)) {
                return { questionId, optionIds: val };
            }
            return { questionId, optionId: val };
        });

        // Create Vietnam time timestamp (UTC+7)
        const now = new Date();
        // Adjust for timezone offset manually to ensure +07:00 string representation
        const vnTime = new Date(now.getTime() + 7 * 60 * 60 * 1000);
        const submissionTime = vnTime.toISOString().replace('Z', '+07:00');

        const payload = {
            answers: answerList,
            submittedAt: submissionTime
        };

        try {
            const result = await PartialApi.submitTheoryExam(id, payload);
            message.success('Nộp bài thành công!');

            // Clear local storage
            try {
                if (id) {
                    sessionStorage.removeItem(`finalExam_${id}_start`);
                    sessionStorage.removeItem(`finalExam_${id}_data`);
                    sessionStorage.removeItem(`finalExam_${id}_questions`);
                    clearAnswersStorage();
                }
            } catch (e) { }

            // Navigate to result page with API result
            navigate(`/final-exam/${id}/result`, {
                state: {
                    examData,
                    resultData: result, // Pass the full API result
                    score: result.totalMarks, // or use result.partials[0]?.marks if structure matches
                    isPass: result.isPass,
                    // keep these for fallback display if needed
                    correctCount: result.partials?.[0]?.marks || 0, // approximation if count not returned
                    totalQuestions: questions.length,
                },
            });
        } catch (error) {
            console.error('Submit error:', error);
            let errorMsg = 'Không thể nộp bài. Vui lòng thử lại.';
            if (error.response) {
                const status = error.response.status;
                if (status === 404) errorMsg = 'Không tìm thấy bài thi (404).';
                else if (status === 403) errorMsg = 'Bạn không có quyền nộp bài thi này (403).';
                else if (status === 401) errorMsg = 'Phiên đăng nhập hết hạn (401).';
                else if (status === 400) errorMsg = error.response.data?.message || 'Dữ liệu không hợp lệ (400).';
                else if (status === 500) errorMsg = 'Lỗi máy chủ (500).';
            }
            message.error(errorMsg);
            setIsSubmitting(false);
            // Keep modal open if it was open, or user can try again
        }
    };

    const answeredCount = Object.keys(answers).length;
    // no banner fallback; use Antd Modal for warnings
    const [overlay, setOverlay] = useState({ visible: false, type: null, msg: '' });
    const overlayBtnRef = useRef(null);
    useEffect(() => {
        if (overlay.visible && overlayBtnRef.current) {
            try { overlayBtnRef.current.focus(); } catch (e) { }
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
                    try { window.focus(); } catch (e) { }
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
                    try { window.focus(); } catch (e) { }
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
                    try { window.focus(); } catch (e) { }
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
                    try { window.focus(); } catch (e) { }
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
                try { e.preventDefault(); e.stopPropagation(); } catch (err) { }
                handleScreenshotAttempt('PrintScreen');
                return;
            }
            // Windows Snip (Win+Shift+S) - try to detect and block
            // On Windows the Windows key is exposed as metaKey in many browsers
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key && e.key.toLowerCase() === 's')) {
                try { e.preventDefault(); e.stopPropagation(); } catch (err) { }
                handleScreenshotAttempt('win-shift-s');
                return;
            }
            // macOS screenshot shortcuts: Cmd/Ctrl + Shift + 3/4
            if ((e.metaKey || e.ctrlKey) && e.shiftKey && (e.key === '3' || e.key === '4')) {
                try { e.preventDefault(); e.stopPropagation(); } catch (err) { }
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
        <div className="min-h-screen bg-neutral-100">
            {overlay.visible && (
                <div className="fixed inset-0 z-[200100] flex items-center justify-center bg-black/60">
                    <div className="w-full max-w-2xl mx-4 bg-white border-2 border-black p-8">
                        <div className="h-1 bg-yellow-400 -mt-8 -mx-8 mb-6" />
                        <h3 className="text-xl font-black mb-4 text-black uppercase">{overlay.type === 'final' ? t('exam.leaveWarningFinalTitle', 'Exam Cancelled') : t('exam.leaveWarningTitle', 'Warning')}</h3>
                        <div className="mb-6 text-neutral-700 leading-relaxed">{overlay.msg}</div>
                        <div className="flex justify-end">
                            <button
                                ref={overlayBtnRef}
                                className="px-6 py-2.5 bg-yellow-400 text-black font-bold uppercase border-2 border-black hover:scale-[1.02] transition-all"
                                onClick={() => {
                                    setOverlay({ visible: false, type: null, msg: '' });
                                    if (overlay.type === 'final') {
                                        handleForceFail();
                                    }
                                }}
                            >
                                {t('common.ok', 'OK')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <HeaderTimer name={examData.name} current={currentQuestionIndex + 1} total={questions.length} answeredCount={answeredCount} timeRemaining={timeRemaining} />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                        <QuestionCard
                            question={{ ...currentQuestion, index: currentQuestionIndex + 1 }}
                            value={answers[currentQuestion?.id]}
                            onChange={handleAnswerChange}
                            onPrevious={handlePrevious}
                            onNext={handleNext}
                            isFirst={currentQuestionIndex === 0}
                            isLast={currentQuestionIndex === questions.length - 1}
                            onSubmitClick={handleSubmitClick}
                            onSaveAnswers={handleManualSave}
                            saveLoading={saveLoading}
                            timeWarning={timeRemaining < 300}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <QuestionSidebar questions={questions} currentIndex={currentQuestionIndex} answers={answers} onSelect={handleQuestionSelect} />
                    </div>
                </div>
            </div>

            <SubmitModal
                open={showSubmitModal}
                onOk={() => { handleFinalSubmit(); }}
                onCancel={() => {
                    if (!isSubmitting) setShowSubmitModal(false);
                }}
                confirmLoading={isSubmitting}
                total={questions.length}
                answeredCount={answeredCount}
            />
        </div>
    );
}
