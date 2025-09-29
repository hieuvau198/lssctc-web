// src/app/pages/SimManager/Settings/Settings.jsx

import React, { useEffect, useState } from 'react';
import { getComponents } from '../../../apis/SimulationManager/SimulationManagerComponentApi';
import UpdateComponent from './partials/UpdateComponent';
import { Typography, Card, Tag, Button, Modal, Pagination, Space, Skeleton, Alert, Tabs, Empty, Badge, Tooltip } from 'antd';
import { CheckCircle2, Pencil } from 'lucide-react';

const { Title, Paragraph, Text } = Typography;

export default function SimSettings() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editing, setEditing] = useState(null); // component being edited

  const pageSize = 5;

  const loadData = async (p = page) => {
    setLoading(true);
    setErr(null);
    try {
      const res = await getComponents(p, pageSize);
      setComponents(res.items || []);
      setTotalPages(res.totalPages || 1);
    } catch (e) {
      setErr(e.message || 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdated = () => {
    setEditing(null);
    loadData();
  };

  useEffect(() => {
    loadData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const items = [
    {
      key: 'components',
      label: 'Components',
      children: (
        <div>
          {err && (
            <Alert className="mb-4" type="error" showIcon message="Failed to load" description={err} />
          )}

          {loading ? (
            <div className="grid grid-cols-1 gap-4">
              {Array.from({ length: 3 }).map((_, idx) => (
                <Card key={idx} className="bg-white">
                  <Skeleton active paragraph={{ rows: 2 }} avatar />
                </Card>
              ))}
            </div>
          ) : components.length === 0 ? (
            <Empty description="No components found" className="bg-white rounded-lg py-10" />
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {components.map((comp) => (
                <Card
                  key={comp.id}
                  className="overflow-hidden border-slate-200 hover:shadow-md transition"
                  bodyStyle={{ padding: 16 }}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-full sm:w-40 h-40 rounded-lg overflow-hidden bg-slate-100">
                      {comp.imageUrl ? (
                        <img src={comp.imageUrl} alt={comp.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400">No image</div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Title level={4} className="!m-0">{comp.name}</Title>
                          <Paragraph className="!mt-1 !mb-2 text-slate-600">{comp.description}</Paragraph>
                          <Space size="small" wrap>
                            <Text type="secondary">ID: {comp.id}</Text>
                            {comp.isActive ? (
                              <Tag color="blue">Active</Tag>
                            ) : (
                              <Tag color="red">Inactive</Tag>
                            )}
                          </Space>
                        </div>
                        <Tooltip title="Edit">
                          <Button type="primary" icon={<Pencil className="w-4 h-4" />} onClick={() => setEditing(comp)}>
                            Edit
                          </Button>
                        </Tooltip>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-center mt-6">
            <Pagination
              current={page}
              pageSize={pageSize}
              total={totalPages * pageSize}
              onChange={(p) => setPage(p)}
              showSizeChanger={false}
            />
          </div>

          <Modal
            title="Update Component"
            open={!!editing}
            onCancel={() => setEditing(null)}
            footer={null}
            width={820}
            destroyOnClose
          >
            {editing && (
              <UpdateComponent
                component={editing}
                onUpdated={handleUpdated}
                onCancel={() => setEditing(null)}
              />
            )}
          </Modal>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-[1380px] mx-auto px-4 py-6">
      <div className="bg-white border rounded-xl p-6 mb-6">
        <Title level={3} className="!mb-1">Settings</Title>
        <Paragraph className="!mb-0 text-slate-600">Manage simulation manager preferences and components.</Paragraph>
      </div>

      <Tabs defaultActiveKey="components" items={items} />
    </div>
  );
}
