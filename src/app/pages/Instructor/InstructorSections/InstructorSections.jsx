import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Input, Select, Tag, Skeleton, Alert, Empty } from 'antd';
import { useTranslation } from 'react-i18next';
import { getInstructorSections } from '../../../mocks/instructorSections';
import { getProgramName } from '../../../mocks/instructorClasses';

const { Option } = Select;

export default function InstructorSections() {
  const { t } = useTranslation();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchValue, setSearchValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState(undefined);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    getInstructorSections({ pageNumber, pageSize, searchTerm, status })
      .then((data) => {
        setSections(data.items);
        setTotal(data.totalCount || 0);
      })
      .catch((err) => setError(err?.message || t('instructor.sections.error.loadFailed')))
      .finally(() => setLoading(false));
  }, [pageNumber, pageSize, searchTerm, status, t]);

  const columns = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => (
        <span className="text-sm text-gray-600">{(pageNumber - 1) * pageSize + index + 1}</span>
      ),
      fixed: 'left',
    },
    {
      title: t('instructor.sections.table.name'),
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (name) => <span className="font-medium text-slate-900">{name}</span>,
    },
    {
      title: t('instructor.sections.table.program'),
      dataIndex: 'programCourseId',
      key: 'program',
      width: 220,
      render: (id) => <span className="text-gray-700">{getProgramName(id)}</span>,
    },
    {
      title: t('instructor.sections.table.classId'),
      dataIndex: 'classesId',
      key: 'classId',
      width: 100,
      align: 'center',
    },
    {
      title: t('instructor.sections.table.order'),
      dataIndex: 'order',
      key: 'order',
      width: 90,
      align: 'center',
    },
    {
      title: t('instructor.sections.table.duration'),
      dataIndex: 'durationMinutes',
      key: 'duration',
      width: 130,
      render: (m) => <span>{m} {t('instructor.sections.mins')}</span>,
    },
    {
      title: t('instructor.sections.table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (s) => (
        <Tag color={String(s) === '1' ? 'green' : 'red'}>{String(s) === '1' ? t('common.active') : t('common.inactive')}</Tag>
      ),
    },
  ], [pageNumber, pageSize, t]);

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPageNumber(1);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-6">
          <Skeleton.Button style={{ width: 220, height: 32 }} active />
        </div>
        <Card>
          <Skeleton active paragraph={{ rows: 8 }} />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Alert message={t('common.error')} description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">{t('instructor.sections.title')}</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input.Search
          placeholder={t('instructor.sections.searchPlaceholder')}
          allowClear
          size="middle"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 320 }}
        />
        <Select
          placeholder={t('instructor.sections.table.status')}
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={(val) => setStatus(val)}
        >
          <Option value="1">{t('common.active')}</Option>
          <Option value="0">{t('common.inactive')}</Option>
        </Select>
      </div>

      {sections.length === 0 ? (
        <Empty description={t('instructor.sections.noSections')} className="mt-16" />
      ) : (
        <Card className="shadow-sm">
          <Table
            columns={columns}
            dataSource={sections}
            rowKey="id"
            pagination={{
              current: pageNumber,
              pageSize,
              total,
              onChange: (p, s) => {
                setPageNumber(p);
                setPageSize(s);
              },
              showSizeChanger: true,
              pageSizeOptions: ['10', '12', '20', '50'],
              showTotal: (total, range) => t('instructor.sections.pagination.showTotal', { start: range[0], end: range[1], total }),
            }}
            scroll={{ y: 420 }}
            size="middle"
          />
        </Card>
      )}
    </div>
  );
}

