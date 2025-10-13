import { ArrowLeftOutlined, BookOutlined, CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Skeleton } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { fetchClassDetail } from '../../../apis/ProgramManager/ClassApi';
import { fetchClasses } from '../../../apis/ProgramManager/ClassesApi';
import slugify from '../../../lib/slugify';
import ClassMembers from './partials/ClassMembers';
import ClassOverview from './partials/ClassOverview';
import ClassSections from './partials/ClassSections';

export default function InstructorClassDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'sections' | 'members'

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
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/instructor/classes')} />
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
                    <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/instructor/classes')} />
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
        <div className="max-w-7xl mx-auto px-4 py-1">
            <div className="flex justify-between items-center gap-3 mb-4">
                <div className="flex items-center gap-x-3">
                    <Button
                        icon={<ArrowLeftOutlined />}
                        onClick={() => navigate('/instructor/classes')}
                        size="middle"
                        className="flex items-center"
                    />
                    <span className="text-2xl font-semibold m-0">Class Details</span>
                </div>
                <div className="inline-flex items-center rounded-lg bg-white shadow-sm">
                    <Button.Group>
                        <Button
                            type={activeTab === 'overview' ? 'primary' : 'text'}
                            icon={<BookOutlined />}
                            onClick={() => setActiveTab('overview')}
                            size="middle"
                        >
                            Overview
                        </Button>
                        <Button
                            type={activeTab === 'sections' ? 'primary' : 'text'}
                            icon={<CalendarOutlined />}
                            onClick={() => setActiveTab('sections')}
                            size="middle"
                        >
                            Sections
                        </Button>
                        <Button
                            type={activeTab === 'members' ? 'primary' : 'text'}
                            icon={<TeamOutlined />}
                            onClick={() => setActiveTab('members')}
                            size="middle"
                        >
                            Members
                        </Button>
                    </Button.Group>
                </div>
            </div>
            {activeTab === 'overview' && <ClassOverview classData={classData} />}
            {activeTab === 'sections' && <ClassSections classData={classData} />}
            {activeTab === 'members' && <ClassMembers classData={classData} />}
        </div>
    );
}