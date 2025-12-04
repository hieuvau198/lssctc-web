import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Descriptions, Tag, Skeleton, Alert, Button, App } from 'antd';
import { ArrowLeft, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { getQuizById } from '../../../../apis/Instructor/InstructorQuiz';
import QuestionList from './QuestionList';

export default function QuizDetails() {
    const { id } = useParams();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        const loadQuiz = async () => {
            if (!id) {
                setError(t('instructor.quizzes.messages.quizIdRequired'));
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await getQuizById(id);
                setQuiz(data);
            } catch (e) {
                setError(e?.message || t('instructor.quizzes.messages.loadQuizFailed'));
                setQuiz(null);
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [id, t]);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-4">
                <Card>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-4">
                <Alert
                    type="error"
                    message={t('common.error')}
                    description={error}
                    action={
                        <Button size="small" onClick={() => navigate('/instructor/quizzes')}>
                            {t('instructor.quizzes.backToList')}
                        </Button>
                    }
                />
            </div>
        );
    }

    if (!quiz) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-4">
                <Alert
                    type="warning"
                    message={t('instructor.quizzes.quizNotFound')}
                    description={t('instructor.quizzes.quizNotFoundDescription')}
                    action={
                        <Button size="small" onClick={() => navigate('/instructor/quizzes')} />
                    }
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/instructor/quizzes')}
                        className="flex items-center"
                    />
                    <div className='flex items-center'>
                        <span className="text-2xl font-bold text-slate-900">{quiz.name}</span>
                    </div>
                </div>
                <Button
                    type="primary"
                    icon={<EditOutlined />}
                    onClick={() => navigate(`/instructor/quizzes/${id}/edit`)}
                >
                    {t('instructor.quizzes.editQuiz')}
                </Button>
            </div>

            {/* Quiz Information Card */}
            <div className="mb-4 shadow-xl rounded-2xl">
                <Card title={t('instructor.quizzes.quizInformation')} className="mb-4">
                    <Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered labelStyle={{ fontWeight: 'bold' }}>
                        <Descriptions.Item label={t('instructor.quizzes.form.quizName')} span={2}>
                            <span>{quiz.name}</span>
                        </Descriptions.Item>

                        <Descriptions.Item label={t('instructor.quizzes.scoreSummary.totalScore')}>
                            <Tag color="blue" className="text-base px-3 py-1">
                                {quiz.totalScore} {t('instructor.quizzes.points')}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label={t('instructor.quizzes.passCriteria')} span={2}>
                            <Tag color="green" className="text-base px-3 py-1">
                                {quiz.passScoreCriteria} {t('instructor.quizzes.points')}
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label={t('instructor.quizzes.timeLimit')}>
                            <Tag color="orange" className="text-base px-3 py-1">
                                {quiz.timelimitMinute} {t('instructor.quizzes.minutes')}
                            </Tag>
                        </Descriptions.Item>


                        <Descriptions.Item label={t('instructor.quizzes.form.description')} span={2}>
                            <div className="text-gray-700 whitespace-pre-wrap">{quiz.description}</div>
                        </Descriptions.Item>

                    </Descriptions>
                </Card>
            </div>

            {/* Quiz Questions Card */}
            <QuestionList quizId={id} />
        </div>
    );
}
