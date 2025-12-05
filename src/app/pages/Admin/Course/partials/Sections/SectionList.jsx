// src/app/pages/Admin/Course/partials/Sections/SectionList.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Button, Popconfirm, message, Tooltip, Card } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined, FileTextOutlined } from '@ant-design/icons';
import { fetchSectionsByCourse, removeSectionFromCourse } from '../../../../../apis/ProgramManager/SectionApi';
import AddSectionModal from './AddSectionModal';
import ImportSectionsModal from './ImportSectionsModal';

const SectionList = ({ courseId }) => {
  const { t } = useTranslation();
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
      message.error(t('admin.courses.sections.loadError'));
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
      message.success(t('admin.courses.sections.removeSuccess'));
      loadSections();
    } catch (error) {
      message.error(error.response?.data?.message || t('admin.courses.sections.removeError'));
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
      title: t('admin.courses.sections.columns.title'),
      dataIndex: 'sectionTitle',
      key: 'sectionTitle',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: t('common.description'),
      dataIndex: 'sectionDescription',
      key: 'sectionDescription',
      ellipsis: true,
    },
    {
      title: t('common.duration'),
      dataIndex: 'estimatedDurationMinutes',
      key: 'estimatedDurationMinutes',
      width: 120,
      render: (mins) => t('admin.courses.sections.durationMins', { mins }),
    },
    {
      title: t('common.actions'),
      key: 'actions',
      width: 100,
      render: (_, record) => (
        <Popconfirm
          title={t('admin.courses.sections.removeTitle')}
          description={t('admin.courses.sections.removeDescription')}
          onConfirm={() => handleRemove(record.id)}
          okText={t('common.yes')}
          cancelText={t('common.no')}
          okButtonProps={{ danger: true }}
        >
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card 
      title={<div className="flex items-center gap-2"><FileTextOutlined /> {t('admin.courses.sections.title')}</div>}
      className="mt-6 shadow-sm"
      extra={
        <div className="flex gap-2">
          <Button 
            icon={<UploadOutlined />} 
            onClick={() => setIsImportModalVisible(true)}
          >
            {t('admin.courses.sections.importExcel')}
          </Button>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => setIsAddModalVisible(true)}
          >
            {t('admin.courses.sections.addSection')}
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
        locale={{ emptyText: t('admin.courses.sections.noSections') }}
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