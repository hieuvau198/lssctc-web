import React from 'react';
import { Card, Typography, List, Tag, Button, Tooltip, Empty } from 'antd';
import { Plus, Edit, X } from 'lucide-react';

const { Title, Text } = Typography;

export default function PracticeTasksList({ tasks, onAssign, onEditTask, onRemoveTask }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <Title level={4} className="!mb-0">Practice Tasks ({tasks.length})</Title>
        <Button 
          type="dashed" 
          onClick={onAssign} 
          icon={<Plus className="w-4 h-4" />}
        >
          Assign Task
        </Button>
      </div>
      <Card className="border-slate-200">
        {tasks.length === 0 ? (
          <Empty description="No steps found. Click 'Assign Task' to add a step." />
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
                      <Tag color="blue">Code: {task.taskCode || 'N/A'}</Tag>
                    </div>
                    <div className="flex space-x-2">
                      <Tooltip title="Edit Task">
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<Edit className="w-4 h-4" />} 
                          onClick={() => onEditTask(task)}
                        />
                      </Tooltip>
                      <Tooltip title="Remove Task from Practice">
                        <Button 
                          type="text" 
                          size="small" 
                          icon={<X className="w-4 h-4 text-red-500" />} 
                          onClick={() => onRemoveTask(task.id)}
                        />
                      </Tooltip>
                    </div>
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
  );
}