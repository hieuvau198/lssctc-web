import React, { useEffect, useMemo, useState } from 'react';
import { Card, Table, Input, Select, Tag, Skeleton, Alert, Empty } from 'antd';
import { getInstructorSections } from '../../../mock/instructorSections';
import { getProgramName } from '../../../mock/instructorClasses';

const { Option } = Select;

export default function InstructorSections() {
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
      .catch((err) => setError(err?.message || 'Failed to load sections'))
      .finally(() => setLoading(false));
  }, [pageNumber, pageSize, searchTerm, status]);

  const columns = useMemo(() => [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => (
        <span className="text-sm text-gray-600">{(pageNumber - 1) * pageSize + index + 1}</span>
      ),
      fixed: 'left',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: 260,
      render: (name) => <span className="font-medium text-slate-900">{name}</span>,
    },
    {
      title: 'Program',
      dataIndex: 'programCourseId',
      key: 'program',
      width: 220,
      render: (id) => <span className="text-gray-700">{getProgramName(id)}</span>,
    },
    {
      title: 'Class ID',
      dataIndex: 'classesId',
      key: 'classId',
      width: 100,
      align: 'center',
    },
    {
      title: 'Order',
      dataIndex: 'order',
      key: 'order',
      width: 90,
      align: 'center',
    },
    {
      title: 'Duration',
      dataIndex: 'durationMinutes',
      key: 'duration',
      width: 130,
      render: (m) => <span>{m} mins</span>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (s) => (
        <Tag color={String(s) === '1' ? 'green' : 'red'}>{String(s) === '1' ? 'Active' : 'Inactive'}</Tag>
      ),
    },
  ], [pageNumber, pageSize]);

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
        <Alert message="Error" description={error} type="error" showIcon />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold">Sections</h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <Input.Search
          placeholder="Search sections..."
          allowClear
          size="middle"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 320 }}
        />
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 160 }}
          value={status}
          onChange={(val) => setStatus(val)}
        >
          <Option value="1">Active</Option>
          <Option value="0">Inactive</Option>
        </Select>
      </div>

      {sections.length === 0 ? (
        <Empty description="No sections found." className="mt-16" />
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
              showTotal: (t, r) => `${r[0]}-${r[1]} of ${t} sections`,
            }}
            scroll={{ y: 420 }}
            size="middle"
          />
        </Card>
      )}
    </div>
  );
}

