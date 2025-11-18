// src/app/pages/Admin/Course/partials/Sections/SectionList.jsx
import React, { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, message, Tooltip, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { fetchSectionsByCourse, removeSectionFromCourse } from '../../../../../apis/ProgramManager/SectionApi';
import AddSectionModal from './AddSectionModal';
import ImportSectionsModal from './ImportSectionsModal';

const SectionList = ({ courseId }) => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);

  const loadSections = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await fetchSectionsByCourse(courseId);
      setSections(data);
    } catch (error) {
      message.error('Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSections();
  }, [courseId]);

  const handleRemove = async (sectionId) => {
    try {
      await removeSectionFromCourse(courseId, sectionId);
      message.success('Section removed from course');
      loadSections();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to remove section');
    }
  };

  const columns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Title',
      dataIndex: 'sectionTitle',
      key: 'sectionTitle',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: 'Description',
      dataIndex: 'sectionDescription',
      key: 'sectionDescription',
      ellipsis: true,
    },
    {
      title: 'Duration',
      dataIndex: 'estimatedDurationMinutes',
      key: 'estimatedDurationMinutes',
      width: 120,
      render: (mins) => `${mins} mins`,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title="Remove this section?"
          description="This will remove the section from this course but keep the section data."
          onConfirm={() => handleRemove(record.id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card 
      title={<div className="flex items-center gap-2"><FileTextOutlined /> Course Sections</div>}
      className="mt-6 shadow-sm"
      extra={
        <div className="flex gap-2">
          <Button 
            icon={<UploadOutlined />} 
            onClick={() => setIsImportModalVisible(true)}
          >
            Import Excel
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsAddModalVisible(true)}
          >
            Add Section
          </Button>
        </div>
      }
    >
      <Table
        dataSource={sections}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: 'No sections assigned to this course yet' }}
      />

      <AddSectionModal
        visible={isAddModalVisible}
        courseId={courseId}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={() => {
          setIsAddModalVisible(false);
          loadSections();
        }}
      />

      <ImportSectionsModal
        visible={isImportModalVisible}
        courseId={courseId}
        onCancel={() => setIsImportModalVisible(false)}
        onSuccess={() => {
          setIsImportModalVisible(false);
          loadSections();
        }}
      />
    </Card>
  );
};

export default SectionList;