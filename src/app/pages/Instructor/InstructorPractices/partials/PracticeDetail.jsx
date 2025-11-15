import React, { useEffect, useState } from 'react';
import { Card, List, Typography, Spin, Alert, Button, Tag, Divider, Descriptions } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { getTasksByPracticeId, getPractices } from '../../../../apis/Instructor/InstructorPractice';
import { getAuthToken } from '../../../../libs/cookies';

const { Title, Text } = Typography;

export default function PracticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [practice, setPractice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = getAuthToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy thông tin practice
        const res = await getPractices({ page: 1, pageSize: 100 });
        const found = res.items.find(p => String(p.id) === String(id));
        setPractice(found || null);
        
        // Lấy danh sách task
        if (token) {
          const data = await getTasksByPracticeId(id, token);
          setTasks(data);
        }
        setError(null);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Không thể tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Card>
          <Spin size="large" />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Alert type="error" message={error} />
        <Button className="mt-4" onClick={() => navigate(-1)}>Quay lại</Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Button onClick={() => navigate(-1)}>← Back</Button>
        <Title level={3} className="!mb-0">Practice Details</Title>
      </div>

      {/* Practice Information */}
      {practice ? (
        <Card className="border-slate-200 shadow-sm">
          <Title level={4} className="mb-4">{practice.practiceName}</Title>
          <Descriptions column={{ xxl: 2, xl: 2, lg: 1, md: 1, sm: 1, xs: 1 }} size="small">
            <Descriptions.Item label="Description">
              {practice.practiceDescription || 'N/A'}
            </Descriptions.Item>
            <Descriptions.Item label="Duration">
              {practice.estimatedDurationMinutes} min
            </Descriptions.Item>
            <Descriptions.Item label="Difficulty">
              <Tag color="blue">{practice.difficultyLevel || 'N/A'}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Max Attempts">
              {practice.maxAttempts}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              <Tag color={practice.isActive ? 'green' : 'red'}>
                {practice.isActive ? 'Active' : 'Inactive'}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Created Date">
              {practice.createdDate ? new Date(practice.createdDate).toLocaleDateString() : 'N/A'}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      ) : (
        <Alert type="warning" message="Practice not found" />
      )}

      <Divider />

      {/* Tasks List */}
      <div>
        <Title level={4}>Practice Tasks ({tasks.length})</Title>
        <Card className="border-slate-200">
          {tasks.length === 0 ? (
            <Text type="secondary">No steps found.</Text>
          ) : (
            <List
              itemLayout="vertical"
              dataSource={tasks}
              renderItem={(task, index) => (
                <List.Item key={task.id} className="mb-4">
                  <Card className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-l-blue-500">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Title level={5} className="!mb-1">
                          Step {index + 1}: {task.taskName}
                        </Title>
                      </div>
                      <Tag color="blue">Task #{task.id}</Tag>
                    </div>
                    
                    <div className="space-y-2">
                      <div>
                        <Text strong>📝 Description:</Text>
                        <p className="ml-0 text-gray-700 mt-1">{task.taskDescription}</p>
                      </div>
                      
                      <div>
                        <Text strong className="text-green-600">✓ Expected Result:</Text>
                        <p className="ml-0 text-green-700 mt-1">{task.expectedResult}</p>
                      </div>
                    </div>
                  </Card>
                </List.Item>
              )}
            />
          )}
        </Card>
      </div>
    </div>
  );
}
