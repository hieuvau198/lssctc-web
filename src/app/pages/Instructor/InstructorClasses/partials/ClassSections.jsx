import { Card, Empty, Skeleton, Table, Tag, Pagination } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { getSectionPartitionsBySection, getSectionsByClass } from '../../../../apis/Instructor/InstructorSectionApi';

const partitionTypeLabel = (typeId) => {
  // Use colors distinct from section status (status uses green/red)
  switch (String(typeId)) {
    case '1':
      return { text: 'PDF', color: 'blue' };
    case '2':
      return { text: 'Video', color: 'purple' };
    case '3':
      return { text: 'Quiz', color: 'orange' };
    default:
      return { text: 'Other', color: 'default' };
  }
};

const isActiveStatus = (status) => String(status) === '1' || Number(status) === 1;
const getStatusText = (status) => (isActiveStatus(status) ? 'Active' : 'Inactive');
const getStatusColor = (status) => (isActiveStatus(status) ? 'green' : 'red');

export default function ClassSections({ classData }) {
  const [sections, setSections] = useState([]);
  const [loadingSections, setLoadingSections] = useState(false);
  const [sectionsError, setSectionsError] = useState(null);
  const [partitionsMap, setPartitionsMap] = useState({}); // id -> { loading, data, error }

  const classId = classData?.classId ?? classData?.id ?? classData?.classID ?? null;

  useEffect(() => {
    if (!classId) {
      setSections([]);
      return;
    }

    let mounted = true;
    const fetchSections = async () => {
      setLoadingSections(true);
      setSectionsError(null);
      try {
        const res = await getSectionsByClass(classId, { page: 1, pageSize: 1000 });
        if (!mounted) return;
        setSections(Array.isArray(res.items) ? res.items : []);
      } catch (err) {
        if (!mounted) return;
        setSectionsError(err?.message || 'Failed to load sections');
        setSections([]);
      } finally {
        if (!mounted) return;
        setLoadingSections(false);
      }
    };

    fetchSections();
    return () => { mounted = false; };
  }, [classId]);

  const columns = useMemo(() => [
    { title: '#', dataIndex: 'index', key: 'index', width: 50, render: (_, __, i) => i + 1 },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 300, render: (t) => <div style={{ fontWeight: 600 }}>{t}</div> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 150, render: (s) => <Tag color={getStatusColor(s)}>{getStatusText(s)}</Tag> },
    { title: 'Duration (min)', dataIndex: 'durationMinutes', key: 'durationMinutes', width: 140 },
    { title: 'Actions', dataIndex: 'actions', key: 'actions', width: 120, render: (_, __, i) => i + 1 },
  ], [partitionsMap]);
  const fetchPartitionsFor = async (sectionId) => {
    setPartitionsMap((m) => ({ ...m, [sectionId]: { loading: true, data: [], totalCount: 0, error: null } }));
    try {
      const res = await getSectionPartitionsBySection(sectionId, { page: 1, pageSize: 200 });
      const items = Array.isArray(res.items) ? res.items : [];
      const total = typeof res.totalCount === 'number' ? res.totalCount : items.length;
      setPartitionsMap((m) => ({ ...m, [sectionId]: { loading: false, data: items, totalCount: total, error: null } }));
    } catch (err) {
      setPartitionsMap((m) => ({ ...m, [sectionId]: { loading: false, data: [], totalCount: 0, error: err?.message || 'Failed to load' } }));
    }
  };

  const handleExpand = (expanded, record) => {
    if (expanded && record && record.id) {
      const entry = partitionsMap[record.id];
      if (!entry || (!entry.loading && entry.data.length === 0 && !entry.error)) {
        fetchPartitionsFor(record.id);
      }
    }
  };

  const expandedRowRender = (parent) => {
    const entry = partitionsMap[parent.id] || { loading: false, data: [], error: null };

    // explicit widths so multiple subtables align the same
    const partCols = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 270, ellipsis: true },
      {
        title: 'Type', dataIndex: 'partitionTypeId', key: 'type', width: 100, render: (id) => {
          const p = partitionTypeLabel(id);
          return <Tag color={p.color}>{p.text}</Tag>;
        }
      },
      { title: 'Actions', dataIndex: 'actions', key: 'actions', width: 100, render: (_, __, i) => i + 1 },
    ];

    // render right-aligned narrow subtable container
    const containerStyle = { display: 'flex', justifyContent: 'flex-end', padding: 8 };
    const innerStyle = { width: 890, maxWidth: '100%' };

    if (entry.loading) return (
      <div style={containerStyle}>
        <div style={innerStyle}>
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      </div>
    );

    if (entry.error) return (
      <div style={containerStyle}>
        <div style={innerStyle}>
          <Empty description={entry.error} />
        </div>
      </div>
    );

    if (!entry.data || entry.data.length === 0) return (
      <div style={containerStyle}>
        <div style={innerStyle}>
          <Empty description="No partitions" />
        </div>
      </div>
    );

    return (
      <div style={containerStyle}>
        <div style={innerStyle}>
          <Table
            columns={partCols}
            dataSource={entry.data}
            rowKey={(r) => r.id || r.partitionId || r.title}
            pagination={false}
            size="small"
            tableLayout="fixed"
            showHeader={false}
          />
        </div>
      </div>
    );
  };

  // pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const total = sections.length;
  const start = (pageNumber - 1) * pageSize;
  const pageItems = sections.slice(start, start + pageSize);

  const renderSkeletonTable = () => {
    const skeletonColumns = columns.map((col) => ({
      ...col,
      render: () => {
        if (col.dataIndex === 'partitionsCount') return <Skeleton.Input active size="small" style={{ width: 60 }} />;
        if (col.dataIndex === 'status') return <Skeleton.Input active size="small" style={{ width: 80 }} />;
        return <Skeleton.Input active size="small" style={{ width: '80%' }} />;
      }
    }));

    const skeletonData = new Array(5).fill(null).map((_, i) => ({ key: `s-${i}`, title: '', description: '', partitionsCount: 0 }));

    return (
      <Card>
        <Table columns={skeletonColumns} dataSource={skeletonData} pagination={false} rowKey={(r) => r.key} size="middle" />
      </Card>
    );
  };

  if (!classId) return (<Card><Empty description="Select a class to view sections" /></Card>);
  if (loadingSections) return renderSkeletonTable();
  if (sectionsError) return (<Card><Empty description={sectionsError} /></Card>);
  if (!sections || sections.length === 0) return (<Card><Empty description="No sections found" /></Card>);

  const tableData = sections.map((s) => ({ ...s, partitionsCount: s.partitionsCount ?? (s.partitions ? s.partitions.length : 0) }));

  return (
    <Card className='shadow-xl'>
      <div style={{ height: 440 }} className="overflow-auto">
        <Table
          columns={columns}
          dataSource={tableData.slice((pageNumber - 1) * pageSize, (pageNumber - 1) * pageSize + pageSize)}
          rowKey={(r) => r.id || r.sectionId || r.title}
          expandable={{ expandedRowRender, onExpand: handleExpand }}
          pagination={false}
          size="middle"
        />
      </div>
      <div className="pt-4 border-t border-gray-200 flex justify-center">
        <Pagination
          current={pageNumber}
          pageSize={pageSize}
          total={total}
          onChange={(p, s) => { setPageNumber(p); setPageSize(s); }}
          showSizeChanger
          pageSizeOptions={['5', '10', '20']}
          showTotal={(t, r) => `${r[0]}-${r[1]} of ${t} sections`}
        />
      </div>
    </Card>
  );
}
