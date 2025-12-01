// src\app\pages\SimManager\Practices\Practices.jsx
import React, { useEffect, useState } from 'react';
import { Empty, Skeleton, Button, App, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import PracticeTable from './partials/PracticeTable';
import { getPractices, deletePractice } from '../../../apis/SimulationManager/SimulationManagerPracticeApi';
import { useNavigate } from 'react-router';

export default function Practices() {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();

  const load = async (p = pageNumber, ps = pageSize) => {
    setLoading(true);
    try {
      const data = await getPractices(p, ps);
      setPractices(data.items || []);
      setTotal(data.totalCount || 0);
    } catch (e) {
      console.error('Failed to load practices', e);
      message.error('Load practices thất bại');
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (record) => {
    Modal.confirm({
      title: 'Confirm Delete',
      content: `Are you sure you want to delete practice "${record.practiceName}"?`,
      okText: 'Delete',
      okType: 'danger',
      onOk: async () => {
        setDeleting(record.id);
        try {
          await deletePractice(record.id);
          message.success('Practice deleted successfully');
          await load(pageNumber, pageSize);
        } catch (err) {
          let errorMsg = 'Delete failed. Please try again.';
          if (err.response?.data?.error?.details?.exceptionMessage) {
            errorMsg = err.response.data.error.details.exceptionMessage;
          } else if (err.response?.data?.error?.message) {
            errorMsg = err.response.data.error.message;
          } else if (err.response?.data?.message) {
            errorMsg = err.response.data.message;
          } else if (err.message) {
            errorMsg = err.message;
          }
          message.error(errorMsg);
        } finally {
          setDeleting(null);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Simulation Practices</h1>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('./create')}
        >
          Create Practice
        </Button>
      </div>

      {/* Content */}
      {practices.length === 0 ? (
        <Empty description="No practices found" />
      ) : (
        <PracticeTable
          data={practices}
          loading={loading}
          deleting={deleting}
          onView={(record) => navigate(`../practices/${record.id}`)}
          onDelete={handleDelete}
          pagination={{
            current: pageNumber,
            pageSize: pageSize,
            total: total,
            onChange: (page, size) => {
              setPageNumber(page);
              setPageSize(size);
            },
          }}
        />
      )}
    </div>
  );
}
