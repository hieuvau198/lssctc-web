import React, { useEffect, useState } from 'react';
import { Table, Card, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { fetchClassesByCourse } from '../../../../apis/ProgramManager/CourseApi';
import dayjs from 'dayjs';
import { CalendarOutlined } from '@ant-design/icons';

const CourseClassList = ({ courseId }) => {
  const { t } = useTranslation();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (courseId) {
      loadClasses();
    }
  }, [courseId]);

  const loadClasses = async () => {
    setLoading(true);
    try {
      const data = await fetchClassesByCourse(courseId);
      setClasses(data);
    } catch (error) {
      console.error('Failed to load classes', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: t('admin.classes.form.classCode') || "Class Code",
      dataIndex: 'classCode',
      key: 'classCode',
      render: (text) => <span className="font-medium">{text}</span>,
    },
    {
      title: t('admin.classes.form.className') || "Class Name",
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: t('admin.classes.form.startDate') || "Start Date",
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: t('admin.classes.form.endDate') || "End Date",
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => date ? dayjs(date).format('DD/MM/YYYY') : '-',
    },
    {
      title: t('admin.classes.columns.capacity') || "Capacity",
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: t('common.status') || "Status",
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'default';
        const s = status ? status.toLowerCase() : '';
        if (s === 'active' || s === 'ongoing') color = 'green';
        else if (s === 'completed') color = 'blue';
        else if (s === 'cancelled') color = 'red';
        else if (s === 'upcoming') color = 'orange';
        
        return <Tag color={color}>{status || 'N/A'}</Tag>;
      }
    },
  ];

  return (
    <Card 
      title={<div className="flex items-center gap-2"><CalendarOutlined /> {t('admin.classes.title') || 'Classes'}</div>} 
      className="mt-6 shadow-sm"
    >
      <Table
        dataSource={classes}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: t('common.noData') || 'No classes found' }}
      />
    </Card>
  );
};

export default CourseClassList;