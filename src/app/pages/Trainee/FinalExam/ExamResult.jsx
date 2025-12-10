import React from 'react';
import { Card, Button, Result, Descriptions, Tag, Progress } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ExamResult() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { examData, resultData, score: navScore, isPass: navIsPass } = location.state || {};

    // Prefer data from API result (resultData) if available, otherwise fallback to navigation params or defaults
    // Note: API (FinalExamDto) usually has 'totalMarks' and 'isPass' fields.
    // Note: API (FinalExamDto) usually has 'totalMarks' and 'isPass' fields.
    // 'marks' in the UI usually refers to the score achieved.

    // Determine the final score and pass status to display
    let displayScore = 0;
    let isPassed = false;

    if (resultData) {
        // 1. Try to get data from the root object first
        displayScore = resultData.totalMarks || resultData.marks || resultData.score || 0;
        isPassed = resultData.isPass === true || String(resultData.isPass).toLowerCase() === 'true';

        // 2. Scenario: Root object might show 0/False if it's an aggregate of multiple parts, 
        // but the user just finished ONE part (e.g. Theory) which IS passed/has marks.
        // If root seems "empty" or "failed" (score 0 and not passed), look deeper into partials.
        if (displayScore === 0 && !isPassed && resultData.partials && Array.isArray(resultData.partials)) {
            // Find the most relevant partial: preferably one that is Submitted/Completed or has marks
            // In the user's case, the Theory partial has marks: 10 and isPass: true, status: "Submitted"
            const relevantPartial = resultData.partials.find(p =>
                (p.status === 'Submitted' || p.status === 'Completed') || (p.marks && p.marks > 0)
            );

            if (relevantPartial) {
                // Determine partial pass status
                const partialPass = relevantPartial.isPass === true || String(relevantPartial.isPass).toLowerCase() === 'true';
                const partialScore = relevantPartial.marks || 0;

                // Use partial data if it looks like a valid result (either passed or has score)
                // This fixes the issue where the user sees "Failed" despite passing the specific component
                displayScore = partialScore;
                isPassed = partialPass;
            }
        }
    } else {
        // Fallback to navigation state if no API result data
        displayScore = navScore || 0;
        isPassed = navIsPass === true || String(navIsPass).toLowerCase() === 'true';
    }

    // Additional info
    const examName = examData?.quizName || examData?.practiceName || examData?.name || t('exam.finalExam', 'Final Exam');
    const examStatus = resultData?.status || examData?.status || (isPassed ? 'Passed' : 'Failed');

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <Card className="shadow-sm">
                    <Result
                        status={isPassed ? 'success' : 'error'}
                        icon={
                            isPassed ? (
                                <CheckCircleOutlined className="text-green-500" />
                            ) : (
                                <CloseCircleOutlined className="text-red-500" />
                            )
                        }
                        title={
                            <span className="text-2xl font-bold">
                                {isPassed
                                    ? t('exam.congratulations', 'Xin chúc mừng!')
                                    : t('exam.failed', 'Chưa đạt')}
                            </span>
                        }
                        subTitle={
                            isPassed
                                ? t('exam.passedMessage', 'Bạn đã hoàn thành bài thi xuất sắc!')
                                : t('exam.failedMessage', 'Rất tiếc, bạn chưa đạt lần này. Hãy tiếp tục học và thử lại!')
                        }
                    />

                    <div className="mt-0">
                        <div className="text-center mb-2">
                            <Progress
                                type="circle"
                                percent={displayScore === 0 ? 0 : 100} // Simplified visual: full circle if score > 0 or just show text
                                strokeColor={isPassed ? '#52c41a' : '#ff4d4f'}
                                width={150}
                                format={() => (
                                    <div>
                                        <div className="text-4xl font-bold">{displayScore}</div>
                                        <div className="text-sm text-slate-500">
                                            {t('exam.yourScore', 'Điểm của bạn')}
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        <Descriptions bordered column={1}>
                            <Descriptions.Item label={t('exam.examName', 'Tên bài thi')}>
                                {examName}
                            </Descriptions.Item>

                            <Descriptions.Item label={t('exam.yourScore', 'Điểm của bạn')}>
                                <Tag color={isPassed ? 'success' : 'error'} className="text-lg font-semibold px-3 py-1">
                                    {displayScore}
                                </Tag>
                            </Descriptions.Item>

                            <Descriptions.Item label={t('exam.status', 'Trạng thái')}>
                                <Tag color={isPassed ? 'success' : 'error'} className="font-semibold uppercase">
                                    {isPassed ? t('exam.passed', 'ĐẠT') : t('exam.notPassed', 'CHƯA ĐẠT')}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>

                    <div className="mt-6 flex justify-center gap-4">
                        <Button
                            type="primary"
                            size="large"
                            href="/"
                            target="_top"
                            icon={<HomeOutlined />}
                        >
                            {t('common.home', 'Trang chủ')}
                        </Button>
                        {!isPassed && examData?.id && (
                            <Button
                                size="large"
                                onClick={() => navigate(`/final-exam/${examData.id}`)}
                            >
                                {t('exam.tryAgain', 'Thử lại')}
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
