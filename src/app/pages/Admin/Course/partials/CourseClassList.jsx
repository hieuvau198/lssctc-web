import React, { useEffect, useState } from 'react';
import { Table, Card, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { fetchClassesByCourse } from '../../../../apis/ProgramManager/CourseApi';
import dayjs from 'dayjs';
import { CalendarOutlined } from '@ant-design/icons';
import DayTimeFormat from '../../../../components/DayTimeFormat/DayTimeFormat';

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
      render: (date) => date ? <DayTimeFormat value={date} /> : '-',
    },
    {
      title: t('admin.classes.form.endDate') || "End Date",
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date) => date ? <DayTimeFormat value={date} /> : '-',
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
    <div className="w-full">
      <Table
        dataSource={classes}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 5 }}
        locale={{ emptyText: t('common.noData') || 'No classes found' }}
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
    </div>
  );
};

export default CourseClassList;