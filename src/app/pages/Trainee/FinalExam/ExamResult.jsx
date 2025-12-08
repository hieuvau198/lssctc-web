import React from 'react';
import { Card, Button, Result, Descriptions, Tag, Progress } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, HomeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export default function ExamResult() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { examData, score, correctCount, totalQuestions } = location.state || {};

    if (!examData) {
        navigate('/');
        return null;
    }

    const passed = score >= examData.passingScore;

    return (
        <div className="min-h-screen bg-slate-50 py-8">
            <div className="max-w-3xl mx-auto px-4">
                <Card className="shadow-sm">
                    <Result
                        status={passed ? 'success' : 'error'}
                        icon={
                            passed ? (
                                <CheckCircleOutlined className="text-green-500" />
                            ) : (
                                <CloseCircleOutlined className="text-red-500" />
                            )
                        }
                        title={
                            <span className="text-2xl font-bold">
                                {passed
                                    ? t('exam.congratulations', 'Congratulations!')
                                    : t('exam.failed', 'Exam Not Passed')}
                            </span>
                        }
                        subTitle={
                            passed
                                ? t('exam.passedMessage', 'You have successfully passed the exam!')
                                : t('exam.failedMessage', 'Unfortunately, you did not pass this time. Keep studying and try again!')
                        }
                    />

                    <div className="mt-0">
                        <div className="text-center mb-2">
                            <Progress
                                type="circle"
                                percent={score}
                                strokeColor={score >= examData.passingScore ? '#52c41a' : '#ff4d4f'}
                                width={150}
                                format={() => (
                                    <div>
                                        <div className="text-4xl font-bold">{score}</div>
                                        <div className="text-sm text-slate-500">
                                            {t('exam.yourScore', 'Your Score')}
                                        </div>
                                    </div>
                                )}
                            />
                        </div>

                        <Descriptions bordered column={1}>
                            <Descriptions.Item label={t('exam.examName', 'Exam Name')}>
                                {examData.name}
                            </Descriptions.Item>
                            <Descriptions.Item label={t('exam.totalQuestions', 'Total Questions')}>
                                {totalQuestions}
                            </Descriptions.Item>
                            <Descriptions.Item label={t('exam.correctAnswers', 'Correct Answers')}>
                                <span className="text-green-600 font-semibold">{correctCount}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={t('exam.incorrectAnswers', 'Incorrect Answers')}>
                                <span className="text-red-600 font-semibold">{totalQuestions - correctCount}</span>
                            </Descriptions.Item>
                            <Descriptions.Item label={t('exam.yourScore', 'Your Score')}>
                                <Tag color={passed ? 'success' : 'error'} className="text-lg font-semibold px-3 py-1">
                                    {score}%
                                </Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t('exam.passingScore', 'Passing Score')}>
                                <Tag color="blue">{examData.passingScore}%</Tag>
                            </Descriptions.Item>
                            <Descriptions.Item label={t('exam.status', 'Status')}>
                                <Tag color={passed ? 'success' : 'error'} className="font-semibold">
                                    {passed ? t('exam.passed', 'PASSED') : t('exam.notPassed', 'NOT PASSED')}
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
                            {t('common.home', 'Back to Home')}
                        </Button>
                        {!passed && (
                            <Button
                                size="large"
                                onClick={() => navigate(`/final-exam/${examData.id || 1}`)}
                            >
                                {t('exam.tryAgain', 'Try Again')}
                            </Button>
                        )}
                    </div>
                </Card>
            </div>
        </div>
    );
}
