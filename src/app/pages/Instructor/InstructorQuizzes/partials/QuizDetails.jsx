import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Descriptions, Tag, Skeleton, Alert, Button, App } from 'antd';
import { ArrowLeftOutlined, EditOutlined } from '@ant-design/icons';
import { getQuizById } from '../../../../apis/Instructor/InstructorQuiz';
import QuestionList from './QuestionList';

export default function QuizDetails() {
    const { id } = useParams();
    const { message } = App.useApp();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        const loadQuiz = async () => {
            if (!id) {
                setError('Quiz ID is required');
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await getQuizById(id);
                setQuiz(data);
            } catch (e) {
                setError(e?.message || 'Failed to load quiz details');
                setQuiz(null);
            } finally {
                setLoading(false);
            }
        };

        loadQuiz();
    }, [id]);

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
                    message="Error"
                    description={error}
                    action={
                        <Button size="small" onClick={() => navigate('/instructor/quizzes')}>
                            Back to List
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
                    message="Quiz Not Found"
                    description="The quiz you are looking for does not exist."
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
                    Edit Quiz
                </Button>
            </div>

            {/* Quiz Information Card */}
            <div className="mb-4 shadow-xl rounded-2xl">
                <Card title="Quiz Information" className="mb-4">
                    <Descriptions column={{ xs: 1, sm: 1, md: 2 }} bordered labelStyle={{ fontWeight: 'bold' }}>
                        <Descriptions.Item label="Quiz Name" span={2}>
                            <span>{quiz.name}</span>
                        </Descriptions.Item>

                        <Descriptions.Item label="Total Score">
                            <Tag color="blue" className="text-base px-3 py-1">
                                {quiz.totalScore} points
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Pass Criteria" span={2}>
                            <Tag color="green" className="text-base px-3 py-1">
                                {quiz.passScoreCriteria} points
                            </Tag>
                        </Descriptions.Item>

                        <Descriptions.Item label="Time Limit">
                            <Tag color="orange" className="text-base px-3 py-1">
                                {quiz.timelimitMinute} minutes
                            </Tag>
                        </Descriptions.Item>


                        <Descriptions.Item label="Description" span={2}>
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
