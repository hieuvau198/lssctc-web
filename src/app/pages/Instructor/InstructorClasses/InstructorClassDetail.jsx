import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, Descriptions, Tag, Button, Skeleton, Alert } from 'antd';
import { ArrowLeftOutlined, CalendarOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { fetchClasses } from '../../../apis/ProgramManager/ClassesApi';
import { fetchClassDetail } from '../../../apis/ProgramManager/ClassApi';
import { getProgramName } from '../../../mock/instructorClasses';
import slugify from '../../../lib/slugify';
import TraineeTable from './partials/TraineeTable';

export default function InstructorClassDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                // Load classes (first page with large pageSize) and find matching slug, then fetch detail by id
                const list = await fetchClasses({ page: 1, pageSize: 1000 });
                const matched = Array.isArray(list?.items) ? list.items.find(c => slugify(c.name) === slug) : null;
                if (!matched) {
                    setError('Class not found');
                } else {
                    const detail = await fetchClassDetail(matched.id);
                    setClassData(detail);
                }
            } catch (err) {
                setError('Error loading class details');
                console.error('Error fetching class detail:', err);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadDetail();
        }
    }, [slug]);

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        return status === '1' ? 'green' : 'orange';
    };

    const getStatusText = (status) => {
        return status === '1' ? 'Active' : 'Inactive';
    };

    const calculateDuration = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return `${diffDays} days`;
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/instructor/classes')}/>
                    <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <Card>
                    <Skeleton active paragraph={{ rows: 8 }} />
                </Card>
            </div>
        );
    }

    if (error || !classData) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-3 mb-6">
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/instructor/classes')}/>       
                </div>
                <Alert
                    message="Error"
                    description={error || 'Class not found'}
                    type="error"
                    showIcon
                />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-2">
            <div className="flex items-center gap-3 mb-6">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/instructor/classes')}
                    size="middle"
                    className="flex items-center"
                />
                <span className="text-2xl font-semibold m-0">Class Details</span>
            </div>

            <div className="mb-6 rounded-2xl shadow-xl">
                <Card>
                    <Descriptions
                        title={
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-semibold">{classData.name}</span>
                                <Tag color={getStatusColor(classData.status)} className="text-sm">
                                    {getStatusText(classData.status)}
                                </Tag>
                            </div>
                        }
                        bordered
                        column={{ xs: 1, sm: 2, md: 2, lg: 3 }}
                        size="middle"
                    >
                        <Descriptions.Item label="Class Code" span={1}>
                            <span className="font-mono font-medium">{classData.classCode.name}</span>
                        </Descriptions.Item>
                        <Descriptions.Item label="Program" span={1}>
                            <div className="flex items-center gap-2">
                                
                                {getProgramName(classData.programCourseId)}
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Capacity" span={1}>
                            <div className="flex items-center gap-2">
                                
                                {classData.capacity} students
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Start Date" span={1}>
                            <div className="flex items-center gap-2">
                                
                                {formatDate(classData.startDate)}
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="End Date" span={1}>
                            <div className="flex items-center gap-2">
                                
                                {formatDate(classData.endDate)}
                            </div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Duration" span={1}>
                            {calculateDuration(classData.startDate, classData.endDate)}
                        </Descriptions.Item>
                        <Descriptions.Item label="Description" span={3}>
                            <div 
                                className="max-h-24 overflow-y-auto pr-2 text-gray-700 leading-relaxed custom-scrollbar"
                                style={{
                                    scrollbarWidth: 'thin',
                                    scrollbarColor: '#cbd5e1 #f1f5f9'
                                }}
                            >
                                {classData.description || 'No description available'}
                            </div>
                            <style jsx>{`
                                .custom-scrollbar::-webkit-scrollbar {
                                    width: 6px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-track {
                                    background: #f1f5f9;
                                    border-radius: 3px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb {
                                    background: #cbd5e1;
                                    border-radius: 3px;
                                }
                                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                                    background: #94a3b8;
                                }
                            `}</style>
                        </Descriptions.Item>
                    </Descriptions>
                </Card>
            </div>

            {/* Trainees Table */}
            <div className="mb-6 rounded-2xl shadow-xl">
                <Card title="Class Trainees" className="py-4">
                    <TraineeTable classId={classData.id} />
                </Card>
            </div>
        </div>
    );
}