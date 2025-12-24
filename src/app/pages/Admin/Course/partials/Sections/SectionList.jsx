// src/app/pages/Admin/Course/partials/Sections/SectionList.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Button, Popconfirm, message, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, UploadOutlined, EditOutlined, LockOutlined } from '@ant-design/icons';
import { fetchSectionsByCourse, removeSectionFromCourse } from '../../../../../apis/ProgramManager/SectionApi';
import { fetchClassesByCourse } from '../../../../../apis/ProgramManager/CourseApi';
import AddSectionModal from './AddSectionModal';
import EditSectionModal from './EditSectionModal';
import ImportSectionsModal from './ImportSectionsModal';

const SectionList = ({ courseId, courseDurationHours = 0 }) => {
  const { t } = useTranslation();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [hasClasses, setHasClasses] = useState(false);

  const loadData = async () => {
    if (!courseId) return;
    setLoading(true);

    // 1. Fetch Sections (Critical for display)
    try {
      const sectionsData = await fetchSectionsByCourse(courseId);
      setSections(sectionsData);
    } catch (error) {
      console.error('Failed to load sections:', error);
      message.error(t('admin.courses.sections.loadError'));
    }

    // 2. Fetch Classes (Validation for add/remove)
    // Run independently so errors (like 404/400) don't block section display
    try {
      const classesData = await fetchClassesByCourse(courseId);
      setHasClasses(classesData && classesData.length > 0);
    } catch (error) {
      console.warn("Failed to check for classes (defaulting to allowing edits):", error);
      setHasClasses(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  const handleRemove = async (sectionId) => {
    try {
      await removeSectionFromCourse(courseId, sectionId);
      message.success(t('admin.courses.sections.removeSuccess'));
      loadData();
    } catch (error) {
      message.error(error.response?.data?.message || t('admin.courses.sections.removeError'));
    }
  };

  const handleEdit = (record) => {
    setSelectedSection(record);
    setIsEditModalVisible(true);
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
      width: 120,
      render: (_, record) => (
        <div className="flex gap-2">
          <Tooltip title={t('common.edit')}>
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          {hasClasses ? (
            <Tooltip title={t('admin.courses.sections.cannotRemoveWithClasses') || "Cannot remove section when classes exist"}>
              <Button type="text" disabled icon={<LockOutlined />} />
            </Tooltip>
          ) : (
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
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <div className="flex justify-end gap-3 mb-4">
        {hasClasses ? (
          <Tooltip title={t('admin.courses.sections.cannotModifyWithClasses') || "Cannot add/import sections when classes exist"}>
            <div className="flex gap-3">
              <button
                disabled
                className="flex items-center gap-2 h-10 px-6 bg-neutral-100 border-2 border-neutral-200 text-neutral-400 cursor-not-allowed font-bold uppercase text-xs tracking-wider"
              >
                <UploadOutlined />
                {t('admin.courses.sections.importExcel')}
              </button>
              <button
                disabled
                className="flex items-center gap-2 h-10 px-6 bg-neutral-100 border-2 border-neutral-200 text-neutral-400 cursor-not-allowed font-black uppercase text-xs tracking-wider"
              >
                <PlusOutlined />
                {t('admin.courses.sections.addSection')}
              </button>
            </div>
          </Tooltip>
        ) : (
          <>
            <button
              onClick={() => setIsImportModalVisible(true)}
              className="flex items-center gap-2 h-10 px-6 bg-white border-2 border-neutral-300 text-neutral-700 hover:border-black hover:text-black hover:bg-neutral-50 transition-all font-bold uppercase text-xs tracking-wider"
            >
              <UploadOutlined />
              {t('admin.courses.sections.importExcel')}
            </button>
            <button
              onClick={() => setIsAddModalVisible(true)}
              className="flex items-center gap-2 h-10 px-6 bg-yellow-400 border-2 border-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500 hover:shadow-md transition-all font-black uppercase text-xs tracking-wider"
            >
              <PlusOutlined />
              {t('admin.courses.sections.addSection')}
            </button>
          </>
        )}
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
        courseDurationMinutes={courseDurationHours * 60}
        existingSections={sections}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={() => {
          setIsAddModalVisible(false);
          loadData();
        }}
      />

      <EditSectionModal
        visible={isEditModalVisible}
        section={selectedSection}
        onCancel={() => {
          setIsEditModalVisible(false);
          setSelectedSection(null);
        }}
        onSuccess={() => {
          setIsEditModalVisible(false);
          setSelectedSection(null);
          loadData();
        }}
      />

      <ImportSectionsModal
        visible={isImportModalVisible}
        courseId={courseId}
        onCancel={() => setIsImportModalVisible(false)}
        onSuccess={() => {
          setIsImportModalVisible(false);
          loadData();
        }}
      />
    </div>
  );
};

export default SectionList;