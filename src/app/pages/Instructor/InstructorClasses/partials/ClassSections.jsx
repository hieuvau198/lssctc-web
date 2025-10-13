import { Card, Skeleton, Table, Tag } from 'antd';
import { useState } from 'react';
import { getSectionPartitions, mockSections } from '../../../../mock/instructorSections';

const partitionTypeLabel = (id) => {
  switch (id) {
    case 1:
      return 'PDF';
    case 2:
      return 'Video';
    default:
      return 'Other';
  }
};

const getStatusText = (status) => (status === 1 || status === '1' ? 'Active' : 'Inactive');

const ClassSections = ({ classData }) => {
  const provided = Array.isArray(classData?.sections) ? classData.sections : [];
  const sections = provided.length ? provided : mockSections;

  const [partitionsMap, setPartitionsMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

//   if (sections.length === 0) {
//     return (
//       <div className="mb-6 rounded-2xl shadow-xl">
//         <Card title="Sections">
//           <Empty description="No sections found." />
//         </Card>
//       </div>
//     );
//   }

  const columns = [
    { title: '#', dataIndex: 'index', key: 'index', width: 50, render: (_, __, i) => i + 1 },
    { title: 'Name', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'Order', dataIndex: 'order', key: 'order', width: 100 },
    { title: 'Duration (min)', dataIndex: 'durationMinutes', key: 'durationMinutes', width: 140 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (s) => <Tag>{getStatusText(s)}</Tag> },
  ];

  const expandedRowRender = (section) => {
    const cached = partitionsMap[section.id];
    const loading = loadingMap[section.id];

    const partitions = Array.isArray(section.partitions) && section.partitions.length
      ? section.partitions
      : Array.isArray(cached)
      ? cached
      : [];
    const partCols = [
      // { title: '#', dataIndex: 'index', key: 'index', width: 50, render: (_, __, i) => i + 1 },
      { title: 'Name', dataIndex: 'name', key: 'name' },
      { title: 'Type', dataIndex: 'partitionTypeId', key: 'partitionTypeId', width: 120, render: (t) => partitionTypeLabel(t) },
      // { title: 'Description', dataIndex: 'description', key: 'description' },
    ];

    return (
      <div>
        {loading ? (
          <div className="py-4">
            <Skeleton active paragraph={{ rows: 3 }} />
          </div>
        ) : (
          <Table
            columns={partCols}
            dataSource={partitions}
            rowKey={(r) => r.id}
            pagination={false}
            size="small"
          />
        )}
      </div>
    );
  };

  const handleExpand = async (expanded, record) => {
    if (expanded) {
      if ((Array.isArray(record.partitions) && record.partitions.length) || partitionsMap[record.id]) return;
      setLoadingMap((s) => ({ ...s, [record.id]: true }));
      try {
        const parts = await getSectionPartitions(record.id);
        setPartitionsMap((s) => ({ ...s, [record.id]: parts }));
      } catch (err) {
        setPartitionsMap((s) => ({ ...s, [record.id]: [] }));
      } finally {
        setLoadingMap((s) => ({ ...s, [record.id]: false }));
      }
    }
  };

  // Pagination state for outer sections table
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = sections.length;
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  const pageItems = sections.slice(start, end);

  return (
    <div className="mb-6 rounded-2xl shadow-xl">
      <Card title={`Sections`}>
        <Table
          columns={columns}
          dataSource={pageItems}
          rowKey={(r) => r.id}
          expandable={{ expandedRowRender, onExpand: handleExpand }}
          pagination={{
            current: pageNumber,
            pageSize,
            total,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '20'],
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size);
            },
          }}
          size="middle"
          scroll={{ y: 320 }}
        />
      </Card>
    </div>
  );
};

export default ClassSections;
