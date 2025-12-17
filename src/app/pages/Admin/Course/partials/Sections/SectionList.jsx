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
    <div className="w-full">
      <div className="flex justify-end gap-3 mb-4">
        <Button
          icon={<UploadOutlined />}
          onClick={() => setIsImportModalVisible(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-none border-2 border-neutral-300 hover:border-black hover:text-black transition-all font-semibold uppercase text-xs tracking-wider"
        >
          {t('admin.courses.sections.importExcel')}
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalVisible(true)}
          className="flex items-center gap-2 h-10 px-4 rounded-none bg-yellow-400 border-2 border-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500 transition-all font-bold uppercase text-xs tracking-wider shadow-sm"
        >
          {t('admin.courses.sections.addSection')}
        </Button>
      </div>

      <Table
        dataSource={sections}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        locale={{ emptyText: t('admin.courses.sections.noSections') }}
        className="industrial-table"
        rowClassName="hover:bg-yellow-50/50 transition-colors"
      />

      <style>{`
        .industrial-table .ant-table-thead > tr > th {
          background: #000 !important;
          color: white !important;
          border-radius: 0 !important;
          text-transform: uppercase;
          font-size: 11px;
          letter-spacing: 0.05em;
          padding: 12px 16px;
        }
        .industrial-table .ant-table-container {
          border: 2px solid #f5f5f5;
        }
      `}</style>

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
    </div>
  );
};

export default SectionList;