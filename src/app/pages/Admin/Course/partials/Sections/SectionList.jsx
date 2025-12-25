// src/app/pages/Admin/Course/partials/Sections/SectionList.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Table, Button, Popconfirm, message, Tooltip, Tag, Spin } from 'antd';
import {
  PlusOutlined, DeleteOutlined, UploadOutlined, EditOutlined, LockOutlined,
  DownOutlined, RightOutlined, FileTextOutlined, RocketOutlined, ExperimentOutlined
} from '@ant-design/icons';
import {
  fetchSectionsByCourse,
  removeSectionFromCourse,
  fetchActivitiesBySection, // Import this
  deleteActivity // Import this
} from '../../../../../apis/ProgramManager/SectionApi';
import { fetchClassesByCourse } from '../../../../../apis/ProgramManager/CourseApi';

import AddSectionModal from './AddSectionModal';
import EditSectionModal from './EditSectionModal';
import ImportSectionsModal from './ImportSectionsModal';
import AddActivityModal from './AddActivityModal'; // Import this
import EditActivityModal from './EditActivityModal'; // Import this

const SectionList = ({ courseId, courseDurationHours = 0 }) => {
  const { t } = useTranslation();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasClasses, setHasClasses] = useState(false);

  // Section Modals
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isImportModalVisible, setIsImportModalVisible] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);

  // Activity Modals
  const [isAddActivityModalVisible, setIsAddActivityModalVisible] = useState(false);
  const [isEditActivityModalVisible, setIsEditActivityModalVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [targetSectionId, setTargetSectionId] = useState(null);

  // Expanded Rows State (to cache activities)
  const [expandedRowKeys, setExpandedRowKeys] = useState([]);
  const [activitiesCache, setActivitiesCache] = useState({}); // { sectionId: [activities] }
  const [loadingActivities, setLoadingActivities] = useState({}); // { sectionId: bool }

  const loadData = async () => {
    if (!courseId) return;
    setLoading(true);

    // 1. Fetch Sections
    try {
      const sectionsData = await fetchSectionsByCourse(courseId);
      setSections(sectionsData);
    } catch (error) {
      console.error('Failed to load sections:', error);
      message.error(t('admin.courses.sections.loadError'));
    }

    // 2. Fetch Classes
    try {
      const classesData = await fetchClassesByCourse(courseId);
      setHasClasses(classesData && classesData.length > 0);
    } catch (error) {
      setHasClasses(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [courseId]);

  // --- Activity Logic ---
  const loadActivitiesForSection = async (sectionId) => {
    setLoadingActivities(prev => ({ ...prev, [sectionId]: true }));
    try {
      const activities = await fetchActivitiesBySection(sectionId);
      setActivitiesCache(prev => ({ ...prev, [sectionId]: activities }));
    } catch (error) {
      message.error(t('admin.courses.sections.activities.loadError'));
    } finally {
      setLoadingActivities(prev => ({ ...prev, [sectionId]: false }));
    }
  };

  const handleExpand = (expanded, record) => {
    if (expanded && !activitiesCache[record.id]) {
      loadActivitiesForSection(record.id);
    }
    setExpandedRowKeys(expanded ? [...expandedRowKeys, record.id] : expandedRowKeys.filter(k => k !== record.id));
  };

  const handleDeleteActivity = async (activityId, sectionId) => {
    try {
      await deleteActivity(activityId);
      message.success(t('admin.courses.sections.activities.removeSuccess'));
      loadActivitiesForSection(sectionId); // Refresh list
    } catch (error) {
      message.error(t('admin.courses.sections.activities.removeError'));
    }
  };

  // --- Renderers ---

  const expandedRowRender = (section) => {
    const isLoading = loadingActivities[section.id];
    const activities = activitiesCache[section.id] || [];

    const activityColumns = [
      {
        title: '',
        key: 'icon',
        width: 40,
        render: (_, r) => {
          if (r.activityType === 'Quiz') return <RocketOutlined className="text-blue-500" />;
          if (r.activityType === 'Practice') return <ExperimentOutlined className="text-purple-500" />;
          return <FileTextOutlined className="text-neutral-500" />;
        }
      },
      { title: t('admin.courses.sections.activities.title'), dataIndex: 'activityTitle', key: 'title', render: (t) => <span className="font-semibold">{t}</span> },
      { title: t('common.type'), dataIndex: 'activityType', key: 'type', width: 100, render: (t) => <Tag>{t}</Tag> },
      { title: t('common.duration'), dataIndex: 'estimatedDurationMinutes', key: 'duration', width: 100, render: (m) => t('admin.courses.sections.durationMins', { mins: m }) },
      {
        title: t('common.actions'),
        key: 'actions',
        width: 100,
        render: (_, record) => (
          <div className="flex gap-2">
            <Button
              size="small"
              type="text"
              icon={<EditOutlined />}
              onClick={() => {
                setSelectedActivity(record);
                setTargetSectionId(section.id); // Track which section we are editing in
                setIsEditActivityModalVisible(true);
              }}
            />
            <Popconfirm title={t('admin.courses.sections.activities.removeConfirm')} onConfirm={() => handleDeleteActivity(record.id, section.id)}>
              <Button size="small" type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </div>
        ),
      },
    ];

    return (
      <div className="bg-neutral-50 p-4 border-t-2 border-neutral-200">
        <div className="flex justify-between items-center mb-3">
          <span className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
            {t('admin.courses.sections.activities.count', { count: activities.length })}
          </span>
          <Button
            size="small"
            type="dashed"
            icon={<PlusOutlined />}
            onClick={() => {
              setTargetSectionId(section.id);
              setIsAddActivityModalVisible(true);
            }}
          >
            {t('admin.courses.sections.activities.add')}
          </Button>
        </div>

        {isLoading ? <Spin className="w-full py-4" /> : (
          <Table
            columns={activityColumns}
            dataSource={activities}
            pagination={false}
            rowKey="id"
            size="small"
            locale={{ emptyText: t('admin.courses.sections.activities.empty') }}
            className="border border-neutral-200 bg-white"
          />
        )}
      </div>
    );
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
              onClick={() => {
                setSelectedSection(record);
                setIsEditModalVisible(true);
              }}
            />
          </Tooltip>

          {hasClasses ? (
            <Tooltip title={t('admin.courses.sections.cannotRemoveWithClasses')}>
              <Button type="text" disabled icon={<LockOutlined />} />
            </Tooltip>
          ) : (
            <Popconfirm
              title={t('admin.courses.sections.removeTitle')}
              description={t('admin.courses.sections.removeDescription')}
              onConfirm={async () => {
                try {
                  await removeSectionFromCourse(courseId, record.id);
                  message.success(t('admin.courses.sections.removeSuccess'));
                  loadData();
                } catch (error) {
                  message.error(error.response?.data?.message || t('admin.courses.sections.removeError'));
                }
              }}
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
          <Tooltip title={t('admin.courses.sections.cannotModifyWithClasses')}>
            <div className="flex gap-3">
              <button disabled className="flex items-center gap-2 h-10 px-6 bg-neutral-100 border-2 border-neutral-200 text-neutral-400 cursor-not-allowed font-bold uppercase text-xs tracking-wider">
                <UploadOutlined /> {t('admin.courses.sections.importExcel')}
              </button>
              <button disabled className="flex items-center gap-2 h-10 px-6 bg-neutral-100 border-2 border-neutral-200 text-neutral-400 cursor-not-allowed font-black uppercase text-xs tracking-wider">
                <PlusOutlined /> {t('admin.courses.sections.addSection')}
              </button>
            </div>
          </Tooltip>
        ) : (
          <>
            <button onClick={() => setIsImportModalVisible(true)} className="flex items-center gap-2 h-10 px-6 bg-white border-2 border-neutral-300 text-neutral-700 hover:border-black hover:text-black hover:bg-neutral-50 transition-all font-bold uppercase text-xs tracking-wider">
              <UploadOutlined /> {t('admin.courses.sections.importExcel')}
            </button>
            <button onClick={() => setIsAddModalVisible(true)} className="flex items-center gap-2 h-10 px-6 bg-yellow-400 border-2 border-yellow-400 text-black hover:bg-yellow-500 hover:border-yellow-500 hover:shadow-md transition-all font-black uppercase text-xs tracking-wider">
              <PlusOutlined /> {t('admin.courses.sections.addSection')}
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
        expandable={{
          expandedRowRender,
          onExpand: handleExpand,
          expandedRowKeys,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <DownOutlined onClick={e => onExpand(record, e)} />
            ) : (
              <RightOutlined onClick={e => onExpand(record, e)} />
            )
        }}
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

      {/* Section Modals */}
      <AddSectionModal
        visible={isAddModalVisible}
        courseId={courseId}
        courseDurationMinutes={courseDurationHours * 60}
        existingSections={sections}
        onCancel={() => setIsAddModalVisible(false)}
        onSuccess={() => { setIsAddModalVisible(false); loadData(); }}
      />
      <EditSectionModal
        visible={isEditModalVisible}
        section={selectedSection}
        onCancel={() => { setIsEditModalVisible(false); setSelectedSection(null); }}
        onSuccess={() => { setIsEditModalVisible(false); setSelectedSection(null); loadData(); }}
      />
      <ImportSectionsModal
        visible={isImportModalVisible}
        courseId={courseId}
        onCancel={() => setIsImportModalVisible(false)}
        onSuccess={() => { setIsImportModalVisible(false); loadData(); }}
      />

      {/* Activity Modals */}
      <AddActivityModal
        visible={isAddActivityModalVisible}
        sectionId={targetSectionId}
        onCancel={() => setIsAddActivityModalVisible(false)}
        onSuccess={() => {
          setIsAddActivityModalVisible(false);
          loadActivitiesForSection(targetSectionId);
        }}
      />

      <EditActivityModal
        visible={isEditActivityModalVisible}
        activity={selectedActivity}
        onCancel={() => { setIsEditActivityModalVisible(false); setSelectedActivity(null); }}
        onSuccess={() => {
          setIsEditActivityModalVisible(false);
          setSelectedActivity(null);
          loadActivitiesForSection(targetSectionId);
        }}
      />

    </div>
  );
};

export default SectionList;