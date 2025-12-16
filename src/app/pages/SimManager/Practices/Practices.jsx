// src\app\pages\SimManager\Practices\Practices.jsx
import React, { useEffect, useState } from 'react';
import { Empty, Skeleton, Button, App, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { FlaskConical } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PracticeTable from './partials/PracticeTable';
import { getPractices, deletePractice } from '../../../apis/SimulationManager/SimulationManagerPracticeApi';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function Practices() {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [practices, setPractices] = useState([]);
  const [pageNumber, setPageNumber] = useState(parseInt(searchParams.get('page')) || 1);
  const [pageSize, setPageSize] = useState(parseInt(searchParams.get('pageSize')) || 10);
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
      message.error(t('simManager.practices.failedToLoad'));
      setPractices([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = (record) => {
    Modal.confirm({
      title: t('simManager.practices.confirmDelete'),
      content: t('simManager.practices.confirmDeleteDesc', { name: record.practiceName }),
      okText: t('common.delete'),
      okType: 'danger',
      onOk: async () => {
        setDeleting(record.id);
        try {
          await deletePractice(record.id);
          message.success(t('simManager.practices.deleteSuccess'));
          await load(pageNumber, pageSize);
        } catch (err) {
          let errorMsg = t('simManager.practices.deleteFailed');
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
    <div className="max-w-[1380px] mx-auto px-4 py-4 space-y-4">
      {/* Header with Violet Gradient */}
      <div className="bg-white/90 backdrop-blur-sm border border-slate-200/60 rounded-2xl overflow-hidden shadow-lg shadow-slate-200/50">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-200/50">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  {t('simManager.practices.title')}
                </span>
              </div>
            </div>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('./create')}
              className="!bg-gradient-to-r !from-violet-500 !to-purple-600 !border-0 hover:!from-violet-600 hover:!to-purple-700"
            >
              {t('simManager.practices.createPractice')}
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      {practices.length === 0 ? (
        <Empty description={t('simManager.practices.noPractices')} />
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
              setSearchParams({ page: page.toString(), pageSize: size.toString() });
              load(page, size);
            },
          }}
        />
      )}
    </div>
  );
}
